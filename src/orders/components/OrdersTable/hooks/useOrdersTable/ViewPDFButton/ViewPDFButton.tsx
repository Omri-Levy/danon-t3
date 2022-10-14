import { CellContext, RowData } from '@tanstack/table-core';
import { PropsWithChildren, useCallback } from 'react';
import { TOrderGetAllOutput } from '../../../../../../common/types';
import { locale } from '../../../../../../common/translations';
import { ModalButton } from '../../../../../../common/components/molecules/Modal/ModalButton/ModalButton';
import { useModalsStore } from '../../../../../../common/stores/modals/modals';

export interface IViewPDFButtonProps<TRowData extends RowData, TValue>
	extends CellContext<TRowData, TValue> {
	orders: TOrderGetAllOutput;
	onIdChange: (id: string) => void;
}

export const ViewPDFButton = <TRowData extends RowData, TValue>({
	orders,
	row: { index },
	onIdChange,
}: PropsWithChildren<IViewPDFButtonProps<TRowData, TValue>>) => {
	const { onToggleIsViewingPDF, isOpen } = useModalsStore(
		(state) => ({
			onToggleIsViewingPDF: state.onToggleIsViewingPDF,
			isOpen: state.isOpen,
		}),
	);
	const id = orders?.[index]?.id ?? '';
	const onToggle = useCallback(() => {
		onIdChange(id);
		onToggleIsViewingPDF();
	}, [onIdChange, id, onToggleIsViewingPDF]);

	return (
		<ModalButton
			className={`btn btn-ghost gap-2`}
			onOpen={onToggle}
			isOpen={isOpen}
		>
			{locale.he.view}
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 20 20'
				fill='currentColor'
				className='w-5 h-5'
			>
				<path d='M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' />
				<path
					fillRule='evenodd'
					d='M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
					clipRule='evenodd'
				/>
			</svg>
		</ModalButton>
	);
};
