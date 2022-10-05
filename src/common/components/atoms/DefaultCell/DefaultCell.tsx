import { EditableInput } from '../EditableInput/EditableInput';
import { CellContext } from '@tanstack/table-core';
import clsx from 'clsx';
import { useDefaultCell } from './hooks/useDefaultCell/useDefaultCell';

export const DefaultCell = <TValue, TQuery>({
	getValue,
	row: { index },
	column: { id },
	table,
}: CellContext<TQuery, TValue>) => {
	const { updateValue, initialValue, className, props } =
		useDefaultCell(getValue, table, index, id);

	return (
		<EditableInput
			onEdit={updateValue}
			initialValue={initialValue}
			className={clsx(
				`px-0 bg-transparent w-full input input-xs text-[1rem] rounded`,
				className,
			)}
			{...props}
		/>
	);
};
