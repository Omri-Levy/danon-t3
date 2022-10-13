import { TComponentWithChildren } from '../../../../types';
import { IModalButtonProps } from './interfaces';

export const ModalButton: TComponentWithChildren<
	IModalButtonProps
> = ({ onOpen, isOpen, children, ...rest }) => {
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
