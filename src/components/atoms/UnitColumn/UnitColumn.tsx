import { useEffect, useState } from 'react';
import { Unit } from '@prisma/client';

export const UnitColumn = ({
	getValue,
	row: { index },
	column: { id },
	table,
}) => {
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
			e.target.blur();
		}

		if (e.key === 'Escape') {
			resetValue();
			e.target.blur();
		}
	};

	// If the initialValue is changed external, sync it up with our state
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<select
			value={value as string}
			className='select bg-transparent w-full '
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={resetValue}
		>
			{Object.values(Unit).map((unit) => (
				<option
					key={unit}
					value={unit}
					disabled={value === unit}
				>
					{unit}
				</option>
			))}
		</select>
	);
};
