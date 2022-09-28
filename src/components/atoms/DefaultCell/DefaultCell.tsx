import { normalizeSpace } from '../../../utils/normalize-space/normalize-space';
import { EditableInput } from '../EditableInput/EditableInput';
import { toast } from 'react-hot-toast';
import { locale } from '../../../translations';
import { CellContext } from '@tanstack/table-core';
import clsx from 'clsx';

export const DefaultCell = <TValue, TQuery>({
	getValue,
	row: { index },
	column: { id },
	table,
}: CellContext<TQuery, TValue>) => {
	const value = getValue();
	const initialValue = normalizeSpace(
		typeof value === 'string' ? value : '',
	);
	// We need to keep and update the state of the cell normally
	// When the input is blurred, we'll call our table meta's updateData function
	const updateValue = async (value: string) => {
		try {
			table.options.meta?.updateData(
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
		table.options.meta?.format(index, id, table) ?? {};

	return (
		<EditableInput
			onEdit={updateValue}
			initialValue={initialValue}
			className={clsx(`bg-transparent w-full input`, className)}
			{...props}
		/>
	);
};
