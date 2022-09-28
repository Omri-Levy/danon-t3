import { FormInput } from '../FormInput/FormInput';
import { FieldValues } from 'react-hook-form/dist/types';
import { HTMLProps } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { SubmitButton } from '../../atoms/SubmitButton/SubmitButton';

export interface IFormChildren {
	Input: typeof FormInput;
	SubmitButton: typeof SubmitButton;
}

export interface IFormProps<
	TFieldValues extends FieldValues = FieldValues,
	TContext = any,
> extends Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> {
	methods: UseFormReturn<TFieldValues, TContext>;
	onSubmit: SubmitHandler<TFieldValues>;
}
