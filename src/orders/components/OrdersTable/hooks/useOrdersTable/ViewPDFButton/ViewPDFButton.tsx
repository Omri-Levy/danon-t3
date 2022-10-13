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
	const { onToggleIsViewingPDF, isOpen } = useModalsStore();
	const id = orders?.[index]?.id ?? '';
	const onToggle = useCallback(() => {
		onIdChange(id);
		onToggleIsViewingPDF();
	}, [onIdChange, id, onToggleIsViewingPDF]);

	return (
		<ModalButton
			className={`btn btn-ghost`}
			onOpen={onToggle}
			isOpen={isOpen}
		>
			{locale.he.view}
		</ModalButton>
	);
};
