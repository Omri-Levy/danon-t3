import { ordersRepository } from './orders.repository';
import {
	TCreateOrderSchema,
	TOrderIdSchema,
	TOrderIdsSchema,
	TSendOrderSchema,
} from './types';
import { getLocaleDateString } from '../../utils/get-locale-date-string/get-locale-date-string';
import { productsRepository } from '../products/products.repository';
import { TRPCError } from '@trpc/server';
import { env } from '../../env/server.mjs';
import { s3Client } from '../s3/s3-client';
import { sendEmail } from '../email/send-email';
import { locale } from '../../translations';
import { appendOrdinal } from './utils/append-ordinal/append-ordinal';

class OrdersService {
	private _repository = ordersRepository;

	async getAll() {
		return this._repository.findMany();
	}

	async getById(input: TOrderIdSchema) {
		return this._repository.findById(input);
	}

	async create(input: TCreateOrderSchema) {
		const { supplierId, ...data } = input;

		return this._repository.create({
			supplierId,
			data,
		});
	}

	async deleteByIds(input: TOrderIdsSchema) {
		return this._repository.deleteManyByIds(input);
	}

	async send(input: TSendOrderSchema) {
		const { pdf } = input;
		const pdfAsString = pdf?.toString();
		const productsToOrder = await productsRepository.findMany({
			where: ['orderAmount', '>', '0'],
		});
		const moreThanOneSupplier =
			new Set(
				productsToOrder?.map(({ supplierId }) => supplierId),
			).size > 1;

		if (!productsToOrder) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message:
					'No products with order amount greater than 0 were found',
			});
		}

		if (moreThanOneSupplier) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message:
					'Sending an order with products from more than one supplier at a time is not allowed',
			});
		}

		const [firstProduct] = productsToOrder;
		const { supplier } = firstProduct ?? {};

		if (!supplier) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message:
					'No supplier was found for the products to order',
			});
		}

		const order = await ordersRepository.create({
			supplierId: supplier.id,
			data: {
				s3Key: 'key',
			},
		});

		if (!order) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Could not create order',
			});
		}

		const ids = productsToOrder.map(({ supplierId, sku }) => ({
			supplierId,
			sku,
		}));

		await productsRepository.updateMany({
			ids,
			data: {
				orderId: order.id,
			},
		});

		const paddedOrderNumber = order.orderNumber
			.toString()
			.padStart(5, '0');
		const filename = `${getLocaleDateString()}-order-#${paddedOrderNumber}.pdf`;
		const date = new Date();
		const year = date.getFullYear();
		const month = date.toLocaleString(undefined, {
			month: 'long',
		});
		const day = appendOrdinal(date.getDate());
		const s3Key = `${supplier.name}/${year}/${month}/${day}-order-#${paddedOrderNumber}.pdf`;

		await ordersRepository.updateById({
			id: order.id,
			data: {
				s3Key,
			},
		});

		const info = await sendEmail({
			from: `${locale.he.mailSender} <${env.EMAIL}>`,
			to: supplier.email,
			subject: locale.he.mailGreeting(
				supplier.name,
				paddedOrderNumber,
			),
			text: locale.he.orderPdf,
			attachments: [
				{
					filename,
					path: pdfAsString,
					contentType: 'application/pdf',
					encoding: 'base64',
				},
			],
		});

		console.log(info);

		const Body = Buffer.from(
			pdfAsString?.replace(
				/^data:application\/pdf;base64,/,
				'',
			) ?? '',
			'base64',
		);

		await s3Client
			.upload({
				Bucket: env.S3_BUCKET,
				Key: s3Key,
				Body,
				ContentEncoding: 'base64',
				ContentType: 'application/pdf',
			})
			.promise();

		await productsRepository.resetManyOrderAmountByIds();

		return;
	}

	async getPresignedUrlById(input: TOrderIdSchema) {
		const { id } = input;
		const order = await ordersRepository.findS3KeyById({
			id,
		});

		if (!order) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Order not found',
			});
		}

		const { s3Key } = order;
		const presignedUrl = await s3Client.getSignedUrlPromise(
			'getObject',
			{
				Bucket: env.S3_BUCKET,
				Key: s3Key,
			},
		);

		if (!presignedUrl) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Could not get presigned URL',
			});
		}

		return presignedUrl;
	}
}

export const ordersService = new OrdersService();
