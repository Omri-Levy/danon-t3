import {
	FieldPath,
	FieldValues,
	useFormContext,
} from 'react-hook-form';
import { PropsWithChildren, ReactNode } from 'react';
import { IFormSelectProps } from './interfaces';

export const FormSelect = <TFields extends FieldPath<FieldValues>>({
	name,
	label,
	options,
	...rest
}: PropsWithChildren<IFormSelectProps<TFields>>) => {
	const {
		formState: { errors },
		register,
		watch,
	} = useFormContext();
	const fieldValue = watch(name);

	return (
		<div>
			<label className={`label block text-right`}>
				<span className={`label-text`}>{label}</span>
			</label>
			<select
				{...rest}
				className='select select-bordered w-full '
				{...register(name)}
			>
				{options.map((o) => (
					<option
						key={`${o}-select-option`}
						disabled={fieldValue === o}
					>
						{o}
					</option>
				))}
			</select>
			{errors[name]?.message && (
				<span className={`label-text text-error`}>
					{errors[name]!.message as ReactNode}
				</span>
			)}
		</div>
	);
};
