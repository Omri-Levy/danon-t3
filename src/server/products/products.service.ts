import { productsRepository } from './products.repository';
import {
	TCreateProductSchema,
	TProductIdSchema,
	TProductIdsSchema,
	TUpdateProductSchema,
} from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';

class ProductsService {
	private _repository = productsRepository;

	async getAll() {
		return this._repository.findMany();
	}

	async getById(input: TProductIdSchema) {
		return this._repository.findById(input);
	}

	async create(input: TCreateProductSchema) {
		const { supplier: name, ...data } = input;
		const supplierId = await suppliersRepository.findIdByName({
			name,
		});

		if (!supplierId) {
			throw new TRPCError({
				message: 'Supplier not found',
				code: 'NOT_FOUND',
			});
		}

		return this._repository.create({
			data,
			supplierId,
		});
	}

	async updateById(input: TUpdateProductSchema) {
		const { id, ...data } = input;

		return this._repository.updateById({
			id,
			data,
		});
	}

	async deleteByIds(input: TProductIdsSchema) {
		return this._repository.deleteManyByIds(input);
	}

	async resetOrderAmountByIds(input: TProductIdsSchema) {
		return this._repository.resetManyOrderAmountByIds(input);
	}
}

export const productsService = new ProductsService();
