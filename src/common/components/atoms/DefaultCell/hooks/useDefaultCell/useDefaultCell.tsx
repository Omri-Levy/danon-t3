import { NoInfer, RowData, Table } from '@tanstack/table-core';
import { normalizeSpace } from '../../../../../utils/normalize-space/normalize-space';
import { toast } from 'react-hot-toast';
import { locale } from '../../../../../translations';

export const useDefaultCell = <TValue, TRowData extends RowData>(
	getValue: () => NoInfer<TValue>,
	table: Table<TRowData>,
	index: number,
	id: string,
) => {
	const value = getValue();
	const initialValue =
		typeof value === 'string' ? normalizeSpace(value) : value;
	// We need to keep and update the state of the cell normally
	// When the input is blurred, we'll call our table meta's updateData function
	const updateValue = async (value: string) => {
		try {
			table.options.meta?.updateData?.(
				index,
				id,
				normalizeSpace(value),
			);
		} catch (err) {
			toast.error(
				`${locale.he.actions.error} ${locale.he.actions.product.update}`,
			);
		}
	};
	const { className = '', ...props } =
		table.options.meta?.format?.(index, id, table) ?? {};

	return {
		updateValue,
		initialValue,
		className,
		props,
	};
};
