import { normalizeSpace } from '../../../utils/normalize-space/normalize-space';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';

export const DefaultCell = ({
	getValue,
	row: { index },
	column: { id },
	table,
}) => {
	const initialValue = normalizeSpace(getValue());
	// We need to keep and update the state of the cell normally
	const [value, setValue] = useState(initialValue);
	// When the input is blurred, we'll call our table meta's updateData function
	const updateValue = async () => {
		try {
			table.options.meta?.updateData(index, id, value);
		} catch (err) {
			if (err instanceof ZodError) {
				const [{ message }] = err.errors;

				setToast({
					message,
					type: 'error',
				});

				return;
			}

			setToast({
				message: `עדכון מוצר: נכשל`,
				type: 'error',
			});
		}
	};
	const resetValue = () => setValue(initialValue);
	const onChange = (e) => setValue(normalizeSpace(e.target.value));
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
		resetValue();
	}, [initialValue]);

	return (
		<input
			type={
				['orderAmount', 'packageSize', 'stock'].some(
					(v) => v === id,
				)
					? 'number'
					: 'text'
			}
			onKeyDown={onKeyDown}
			onBlur={resetValue}
			className={`bg-transparent w-full input`}
			value={value ?? ('' as string)}
			onChange={onChange}
			step={
				id === 'orderAmount'
					? table.getRow(index.toString()).original
							.packageSize
					: undefined
			}
			min={0}
		/>
	);
};
