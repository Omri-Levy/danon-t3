import { FieldValues, FormProvider } from 'react-hook-form';
import { FormInput } from './FormInput/FormInput';
import { SubmitButton } from './SubmitButton/SubmitButton';
import { FormSelect } from './FormSelect/FormSelect';
import { IFormChildren, IFormProps } from './interfaces';
import { FunctionComponent } from 'react';

export const getForm = <
	TFormValues extends FieldValues = FieldValues,
	TContext = any,
>() => {
	const Form: FunctionComponent<IFormProps<TFormValues, TContext>> &
		IFormChildren = ({
		children,
		methods,
		onSubmit,
		...props
	}) => {
		return (
			<FormProvider {...methods}>
				<form
					noValidate
					onSubmit={methods.handleSubmit(onSubmit)}
					{...props}
				>
					{children}
				</form>
			</FormProvider>
		);
	};
	Form.Input = FormInput;
	Form.Select = FormSelect;
	Form.SubmitButton = SubmitButton;

	return Form;
};
