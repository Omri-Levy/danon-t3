import {
	FieldPath,
	FieldValues,
	useFormContext,
} from 'react-hook-form';
import { PropsWithChildren, ReactNode } from 'react';
import { FormInputProps } from './interfaces';

export const FormInput = <TFields extends FieldPath<FieldValues>>({
	name,
	label,
	...rest
}: FormInputProps<TFields> & PropsWithChildren) => {
	const {
		formState: { errors },
		register,
	} = useFormContext();

	return (
		<div>
			<label className={`label block text-right`}>
				<span className={`label-text`}>{label}</span>
			</label>
			<input
				{...rest}
				className={`input input-bordered w-full `}
				{...register(name, {
					valueAsNumber: rest.type === `number`,
				})}
			/>
			{errors[name]?.message && (
				<span className={`label-text text-error`}>
					{errors[name]!.message as ReactNode}
				</span>
			)}
		</div>
	);
};
