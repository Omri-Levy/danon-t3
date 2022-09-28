import { useRef, useState } from 'react';
import { CellContext, RowData } from '@tanstack/table-core';

export const SelectColumn = <TRowData extends RowData, TValue>({
	options,
	getValue,
	row: { index },
	column: { id },
	table,
}: CellContext<TRowData | null, TValue> & {
	options: Array<string>;
}) => {
	const ref = useRef<HTMLSelectElement>(null);
	const initialValue = getValue();
	// We need to keep and update the state of the cell normally
	const [value, setValue] = useState(initialValue);
	// When the input is blurred, we'll call our table meta's updateData function
	const updateValue = () => {
		table.options.meta?.updateData(index, id, value);
	};
	const resetValue = () => setValue(initialValue);
	const onChange = (e) => setValue(e.target.value);
	const onKeyDown = async (e) => {
		if (e.key === 'Enter') {
			updateValue();
			ref.current?.blur();
		}

		if (e.key === 'Escape') {
			resetValue();
			ref.current?.blur();
		}
	};

	return (
		<select
			ref={ref}
			value={value as string}
			className='select bg-transparent w-full'
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={resetValue}
		>
			{options.map((option) => (
				<option
					key={option}
					value={option}
					disabled={value === option}
				>
					{option}
				</option>
			))}
		</select>
	);
};
