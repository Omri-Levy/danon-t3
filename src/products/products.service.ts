import { productsRepository } from './products.repository';
import {
	TCreateProductSchema,
	TProductIdSchema,
	TProductIdsSchema,
	TUpdateProductSchema,
} from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { locale } from '../common/translations';
import { isDuplicateEntryError } from '../common/utils/is-duplicate-entry-error/is-duplicate-entry-error';
import { zSupplierNamesEnum } from '../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';

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
		const suppliers = await suppliersRepository.findMany({
			include: ['id', 'name'],
		});
		const supplierNames = suppliers.map(({ name }) => name);
		const supplierId = suppliers.find(
			(supplier) => supplier.name === name,
		)?.id;

		if (!supplierNames?.length || !supplierId) {
			throw new TRPCError({
				message: locale.he.validation.supplier.notFound(
					!supplierNames?.length,
				),
				code: 'NOT_FOUND',
			});
		}

		const result =
			zSupplierNamesEnum(supplierNames).safeParse(name);

		if (!result.success) {
			throw new TRPCError({
				message: result.error.format()._errors.at(0),
				code: 'BAD_REQUEST',
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
