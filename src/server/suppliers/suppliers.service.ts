import { suppliersRepository } from './suppliers.repository';
import {
	TCreateSupplierSchema,
	TSupplierIdSchema,
	TSupplierIdsSchema,
	TUpdateSupplierSchema,
} from './types';

class SuppliersService {
	private _repository = suppliersRepository;

	async getAll() {
		return this._repository.findMany();
	}

	async getById(input: TSupplierIdSchema) {
		return this._repository.findById(input);
	}

	async create(input: TCreateSupplierSchema) {
		return this._repository.create(input);
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
