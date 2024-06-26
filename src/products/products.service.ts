import XLSX from 'xlsx';
import { productsRepository } from './products.repository';
import {
	TCreateProductSchema,
	TImportCSVSchema,
	TProductIdSchema,
	TProductIdsSchema,
	TUpdateProductSchema,
} from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { locale } from '../common/translations';
import { isDuplicateEntryError } from '../common/utils/is-duplicate-entry-error/is-duplicate-entry-error';
import { zSupplierNamesEnum } from '../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';
import { db } from '../db/client';
import { sql } from 'kysely';
import { camelCase } from 'lodash';

class ProductsService {
	private _repository = productsRepository;

	async getAll() {
		const result = await this._repository.findMany();

		return result.map((product) => ({
			...product,
			id: `${product.supplierId}-${product.sku}`,
			cost:
				parseFloat(product.pricePerUnit) *
				parseFloat(product.stock),
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

	async importCSV(input: TImportCSVSchema) {
		const { file } = input;
		const workbook = XLSX.read(file, { type: 'binary' });
		const [sheetName = ''] = workbook.SheetNames;
		const worksheet = workbook.Sheets[sheetName];

		if (!worksheet) {
			throw new TRPCError({
				message: `Invalid CSV file`,
				code: 'BAD_REQUEST',
			});
		}

		const json = XLSX.utils.sheet_to_json(worksheet);
		// Transform Title Case keys to camelCase.
		// The database expects name instead of productName.
		const formattedJson = json.map((item) =>
			Object.entries(item).reduce((acc, [key, value]) => {
				const newKey = (() => {
					const camelCaseKey = camelCase(key);

					if (camelCaseKey === 'productName') {
						return 'name';
					}

					return camelCaseKey;
				})();

				acc[newKey] = value;

				return acc;
			}, {}),
		);
		// Get the supplier id of each product using the supplier's name and replace the supplier key with supplierId.
		const withSupplierId = await Promise.all(
			formattedJson.map(async ({ supplier: name, ...item }) => {
				const supplierId =
					await suppliersRepository.findIdByName({
						name,
					});

				return {
					...item,
					supplierId,
				};
			}),
		);

		// If a product exists, update it. Otherwise, create it.
		await db
			.insertInto('product')
			.values(withSupplierId)
			.onDuplicateKeyUpdate({
				supplierId: sql`VALUES(supplierId)`,
				sku: sql`VALUES(sku)`,
				name: sql`VALUES(name)`,
				unit: sql`VALUES(unit)`,
				packageSize: sql`VALUES(packageSize)`,
				orderAmount: sql`VALUES(orderAmount)`,
				pricePerUnit: sql`VALUES(pricePerUnit)`,
				stock: sql`VALUES(stock)`,
			})
			.execute();

		return this.getAll();
	}
}

export const productsService = new ProductsService();
