import { NoInfer, RowData, Table } from '@tanstack/table-core';
import {
	ChangeEventHandler,
	KeyboardEventHandler,
	useCallback,
	useRef,
	useState,
} from 'react';

export const useSelectColumn = <
	TValue extends string | number | undefined | unknown,
	TRowData extends RowData,
>(
	getValue: () => NoInfer<TValue>,
	table: Table<TRowData>,
	index: number,
	id: string,
) => {
	const ref = useRef<HTMLSelectElement>(null);
	const initialValue = getValue();
	// We need to keep and update the state of the cell normally
	const [value, setValue] = useState(initialValue);
	// When the input is blurred, we'll call our table meta's updateData function
	const updateValue = useCallback(() => {
		table.options.meta?.updateData(index, id, value);
	}, [index, id, value, table.options.meta?.updateData]);
	const resetValue = useCallback(() => {
		if (value === initialValue) return;

		setValue(initialValue);
	}, [setValue, value, initialValue]);
	const onChange: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(e) => {
				if ((e.target.value as any) === value) return;

				setValue(e.target.value as any);
			},
			[setValue, value],
		);
	const onKeyDown: KeyboardEventHandler = useCallback(
		async (e) => {
			switch (e.key) {
				case 'Enter':
					if (value === initialValue) return;

					updateValue();
					ref.current?.blur();
					break;
				case 'Escape':
					resetValue();
					ref.current?.blur();
					break;
				default:
					break;
			}
		},
		[
			value,
			initialValue,
			updateValue,
			resetValue,
			ref.current?.blur,
		],
	);

	return {
		ref,
		value,
		onChange,
		onKeyDown,
		resetValue,
	};
};
