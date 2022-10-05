import { productsRepository } from './products.repository';
import {
	TCreateProductSchema,
	TProductIdSchema,
	TProductIdsSchema,
	TUpdateProductSchema,
} from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { locale } from '../../translations';
import { isDuplicateEntryError } from '../../utils/is-duplicate-entry-error/is-duplicate-entry-error';

class ProductsService {
	private _repository = productsRepository;

	async getAll() {
		const result = await this._repository.findMany();

		return result.map((product) => ({
			...product,
			id: `${product.supplierId}-${product.sku}`,
		}));
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

		try {
			return await this._repository.create({
				data,
				supplierId,
			});
		} catch (err) {
			if (!isDuplicateEntryError(err)) throw err;

			throw new TRPCError({
				message: locale.he.validation.product.alreadyExists(
					input.sku,
				),
				code: 'BAD_REQUEST',
			});
		}
	}

	async updateById(input: TUpdateProductSchema) {
		const { id, ...data } = input;

		try {
			return await this._repository.updateById({
				id,
				data,
			});
		} catch (err) {
			if (!isDuplicateEntryError(err) || !input.sku) throw err;

			throw new TRPCError({
				message: locale.he.validation.product.alreadyExists(
					input.sku,
				),
				code: 'BAD_REQUEST',
			});
		}
	}

	async deleteByIds(input: TProductIdsSchema) {
		return this._repository.deleteManyByIds(input);
	}

	async resetOrderAmountByIds(input: TProductIdsSchema) {
		return this._repository.resetManyOrderAmountByIds(input);
	}
}

export const productsService = new ProductsService();
