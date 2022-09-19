import { FunctionComponent } from 'react';
import { FormProvider } from 'react-hook-form';
import { FormInput } from '../FormInput/FormInput';
import { IFormChildren, IFormProps } from './interfaces';
import { SubmitButton } from '../../atoms/SubmitButton/SubmitButton';

export const Form: FunctionComponent<IFormProps> & IFormChildren = ({
	children,
	onSubmit,
	methods,
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
Form.SubmitButton = SubmitButton;
