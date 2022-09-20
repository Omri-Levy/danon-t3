import { ordersRepository } from './orders.repository';
import {
	TCreateOrderSchema,
	TOrderIdSchema,
	TOrderIdsSchema,
	TSendOrderSchema,
	TUpdateOrderSchema,
} from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { sendEmail } from '../email/send-email';
import { getLocaleDateString } from '../../utils/get-locale-date-string/get-locale-date-string';
import { productsRepository } from '../products/products.repository';

class OrdersService {
	private _repository = ordersRepository;

	async getAll() {
		return this._repository?.findMany();
	}

	async getById(input: TOrderIdSchema) {
		return this._repository?.findById(input);
	}

	async create(input: TCreateOrderSchema) {
		const { supplierId, ...data } = input;

		return this._repository?.create({
			supplierId,
			data,
		});
	}

	async updateById(input: TUpdateOrderSchema) {
		const { id, ...data } = input;

		return this._repository?.updateById({
			id,
			data,
		});
	}

	async deleteByIds(input: TOrderIdsSchema) {
		return this._repository?.deleteManyByIds(input);
	}

	async send(input: TSendOrderSchema) {
		const { name, pdf } = input;
		const supplier = await suppliersRepository.findByName({
			name,
		});

		const info = await sendEmail({
			from: process.env.EMAIL,
			to: supplier?.email,
			subject: `Hello ${
				supplier?.name
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
