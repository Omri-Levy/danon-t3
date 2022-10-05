import { FieldPath, FieldValues } from 'react-hook-form';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface IFormInputProps<
	TFields extends FieldPath<FieldValues>,
> extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	name: TFields;
	label: string;
}
