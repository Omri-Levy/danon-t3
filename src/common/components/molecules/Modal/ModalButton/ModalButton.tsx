import { TComponentWithChildren } from '../../../../types';
import { ComponentProps } from 'react';

export const ModalButton: TComponentWithChildren<
	{
		isOpen: boolean;
		onOpen: () => void;
	} & ComponentProps<'button'>
> = ({ isOpen, onOpen, children, ...rest }) => {
	return (
		<button
			aria-haspopup={`dialog`}
			aria-expanded={isOpen}
			aria-controls={`radix-:rhn:`}
			className={`btn`}
			onClick={onOpen}
			data-state={isOpen ? 'open' : 'closed'}
			type={`button`}
			{...rest}
		>
			{children}
		</button>
	);
};
