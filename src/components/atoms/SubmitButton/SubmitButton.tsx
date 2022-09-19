import { FunctionComponent, HTMLProps } from 'react';

export const SubmitButton: FunctionComponent<
	HTMLProps<HTMLButtonElement>
> = ({ children, ...props }) => (
	<button {...props} className={'btn mt-2 mr-auto'} type={`submit`}>
		{children}
	</button>
);
