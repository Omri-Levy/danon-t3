import { FunctionComponent, HTMLProps } from 'react';

export const SubmitButton: FunctionComponent<
	HTMLProps<HTMLButtonElement>
> = ({ children, ...props }) => (
	<button className={'btn mt-2 mr-auto'} {...props} type={`submit`}>
		{children}
	</button>
);
