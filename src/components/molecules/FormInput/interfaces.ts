import { FieldPath, FieldValues } from 'react-hook-form';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface FormInputProps<
	TFields extends FieldPath<FieldValues>,
> extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	name: TFields;
	label: string;
}
