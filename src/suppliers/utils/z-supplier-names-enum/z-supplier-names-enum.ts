import { z } from 'zod';
import { locale } from '../../../common/translations';

export const zSupplierNamesEnum = (supplierNames: Array<string>) =>
	z.custom(
		(value) =>
			typeof value === 'string' &&
			supplierNames?.includes(value),
		{
			message:
				locale.he.validation.supplier.name.enum(
					supplierNames,
				),
		},
	);
