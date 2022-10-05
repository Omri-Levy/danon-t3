import { CellContext, RowData } from '@tanstack/table-core';
import { useSelectColumn } from './hooks/useSelectColumn/useSelectColumn';

export const SelectColumn = <
	TRowData extends RowData,
	TValue extends string | number | undefined | unknown,
>({
	options,
	getValue,
	row: { index },
	column: { id },
	table,
}: CellContext<TRowData, TValue> & {
	options: Array<string>;
}) => {
	const { ref, value, onChange, onKeyDown, resetValue } =
		useSelectColumn(getValue, table, index, id);
	// Satisfies the type checker both here and in the useTable hook.
	const typesafeValue =
		typeof value !== 'undefined' &&
		typeof value !== 'string' &&
		typeof value !== 'number'
			? options.at(0)
			: value;

	return (
		<select
			ref={ref}
			value={typesafeValue}
			className={`select bg-transparent w-full select-xs text-[1rem]`}
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={resetValue}
		>
			{options.map((option) => (
				<option
					key={option}
					value={option}
					disabled={value === (option as any)}
				>
					{option}
				</option>
			))}
		</select>
	);
};
