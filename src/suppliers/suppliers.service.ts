import { suppliersRepository } from './suppliers.repository';
import {
	TCreateSupplierSchema,
	TSupplierIdSchema,
	TSupplierIdsSchema,
	TUpdateSupplierSchema,
} from './types';
import { TRPCError } from '@trpc/server';
import { locale } from '../common/translations';
import { isDuplicateEntryError } from '../common/utils/is-duplicate-entry-error/is-duplicate-entry-error';

class SuppliersService {
	private _repository = suppliersRepository;

	async getAll() {
		return this._repository.findMany();
	}

	async getById(input: TSupplierIdSchema) {
		return this._repository.findById(input);
	}

	async create(input: TCreateSupplierSchema) {
		try {
			return await this._repository.create(input);
		} catch (err) {
			if (!isDuplicateEntryError(err)) throw err;

			throw new TRPCError({
				message: err.sqlMessage.includes('name')
					? locale.he.validation.supplier.nameAlreadyExists(
							input.name,
					  )
					: locale.he.validation.supplier.emailAlreadyExists(
							input.email,
					  ),
				code: 'BAD_REQUEST',
			});
		}
	}

	async updateById(input: TUpdateSupplierSchema) {
		const { id, ...data } = input;

		return this._repository.updateById({
			id,
			data,
		});
	}

	async deleteByIds(input: TSupplierIdsSchema) {
		return this._repository.deleteManyByIds(input);
	}
}

export const suppliersService = new SuppliersService();
