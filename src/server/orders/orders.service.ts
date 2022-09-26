import { ordersRepository } from './orders.repository';
import {
	TCreateOrderSchema,
	TOrderIdSchema,
	TOrderIdsSchema,
	TSendOrderSchema,
	TUpdateOrderSchema,
} from './types';
import { getLocaleDateString } from '../../utils/get-locale-date-string/get-locale-date-string';
import { productsRepository } from '../products/products.repository';
import { TRPCError } from '@trpc/server';
import { env } from '../../env/server.mjs';
import { s3Client } from '../s3/s3-client';
import { sendEmail } from '../email/send-email';
import { locale } from '../../translations';

const appendOrdinal = (number: number) => {
	const modulusOfTen = number % 10;
	const modulusOfHundred = number % 100;

	if (modulusOfTen === 1 && modulusOfHundred !== 11) {
		return `${number}st`;
	}

	if (modulusOfTen === 2 && modulusOfHundred !== 12) {
		return `${number}nd`;
	}

	if (modulusOfTen === 3 && modulusOfHundred !== 13) {
		return `${number}rd`;
	}

	return `${number}th`;
};

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

	async updateById(input: TUpdateOrderSchema) {
		const { id, ...data } = input;

		return this._repository.updateById({
			id,
			data,
		});
	}

	async deleteByIds(input: TOrderIdsSchema) {
		return this._repository.deleteManyByIds(input);
	}

	async send(input: TSendOrderSchema) {
		const { pdf } = input;
		const productsToOrder = await productsRepository.findMany({
			where: {
				orderAmount: {
					gt: 0,
				},
			},
			include: {
				supplier: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
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
				products: {
					connect: productsToOrder.map(
						({ supplierId, sku }) => ({
							supplierId_sku: {
								supplierId,
								sku,
							},
						}),
					),
				},
			},
		});

		if (!order) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Could not create order',
			});
		}

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
					path: pdf as string,
					contentType: 'application/pdf',
					encoding: 'base64',
				},
			],
		});

		console.log(info);

		const Body = Buffer.from(pdf?.toString() ?? '', 'base64');

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
}

export const ordersService = new OrdersService();
