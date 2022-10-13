import { ComponentProps } from 'react';
import { IModalProps } from '../interfaces';

export interface IModalButtonProps
	extends Omit<ComponentProps<'button'>, 'type'>,
		Pick<IModalProps, 'onOpen' | 'isOpen'> {}
