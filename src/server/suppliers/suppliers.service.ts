import { suppliersRepository } from './suppliers.repository';
import {
	TCreateSupplierSchema,
	TSupplierIdSchema,
	TSupplierIdsSchema,
	TUpdateSupplierSchema,
} from './types';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { locale } from '../../translations';

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
			const result = await this._repository.create(input);

			return result;
		} catch (err) {
			if (
				!(err instanceof Prisma.PrismaClientKnownRequestError)
			) {
				throw err;
			}

			if (err.code === 'P2002') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message:
						locale.he.validation.supplier.alreadyExists(
							input.email,
						),
				});
			}
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
