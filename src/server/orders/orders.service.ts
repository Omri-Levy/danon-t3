import { ordersRepository } from './orders.repository';
import {
	TCreateOrderSchema,
	TOrderIdSchema,
	TOrderIdsSchema,
	TSendOrderSchema,
	TUpdateOrderSchema,
} from './types';
import { sendEmail } from '../email/send-email';
import { getLocaleDateString } from '../../utils/get-locale-date-string/get-locale-date-string';
import { productsRepository } from '../products/products.repository';
import { TRPCError } from '@trpc/server';

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

		const info = await sendEmail({
			from: process.env.EMAIL,
			to: supplier.email,
			subject: `Hello ${
				supplier.name
			}, please accept this order. #${'orderNumber'}`,
			text: `Order PDF attached.`,
			attachments: [
				{
					filename: `order-${getLocaleDateString()}-#${'orderNumber'}.pdf`,
					path: pdf as string,
					contentType: 'application/pdf',
					encoding: 'base64',
				},
			],
		});

		console.log(info);

		await productsRepository.resetOrderAmount();

		return;
	}
}

export const ordersService = new OrdersService();
