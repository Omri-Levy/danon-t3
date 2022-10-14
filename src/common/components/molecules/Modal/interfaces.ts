import { ComponentProps } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export interface IModalProps {
	title: string;
	isOpen: boolean;
	onOpen: () => void;
	contentProps?: ComponentProps<typeof Dialog.Content>;
}
