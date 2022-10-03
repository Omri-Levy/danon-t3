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
			return await this._repository.create(input);
		} catch (err) {
			if (
				!(err instanceof Prisma.PrismaClientKnownRequestError)
			) {
				throw err;
			}

			if (err.code === 'P2002') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: (err as any).meta.target.includes('name')
						? locale.he.validation.supplier.nameAlreadyExists(
								input.name,
						  )
						: locale.he.validation.supplier.emailAlreadyExists(
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
