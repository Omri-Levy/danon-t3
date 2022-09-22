import { normalizeSpace } from '../../../utils/normalize-space/normalize-space';
import { ZodError } from 'zod';
import { EditableInput } from '../EditableInput/EditableInput';

export const DefaultCell = ({
	getValue,
	row: { index },
	column: { id },
	table,
}) => {
	const initialValue = normalizeSpace(getValue());
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
			if (err instanceof ZodError) {
				// const [firstIssue] = err.errors;
				// const { message } = firstIssue ?? {};

				// setToast({
				// 	message,
				// 	type: 'error',
				// });

				return;
			}

			// setToast({
			// 	message: `עדכון מוצר: נכשל`,
			// 	type: 'error',
			// });
		}
	};

	return (
		<EditableInput
			onEdit={updateValue}
			initialValue={initialValue}
			type={
				['orderAmount', 'packageSize', 'stock'].some(
					(v) => v === id,
				)
					? 'number'
					: 'text'
			}
			className={`bg-transparent w-full input`}
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
