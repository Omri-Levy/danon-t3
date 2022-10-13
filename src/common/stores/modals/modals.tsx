import create from 'zustand';
import produce from 'immer';
import { CreateProductModal } from '../../../products/components/CreateProductModal/CreateProductModal';
import { CreateSupplierModal } from '../../../suppliers/components/CreateSupplierModal/CreateSupplierModal';
import { SendOrderModal } from '../../../products/components/SendOrderModal/SendOrderModal';
import { PrintModal } from '../../../products/components/PrintModal/PrintModal';
import { ViewPDFModal } from '../../../orders/components/ViewPDFModal/ViewPDFModal';

export enum EModalType {
	CREATE_SUPPLIER = 'EDIT_PRODUCT',
	CREATE_PRODUCT = 'CREATE_PRODUCT',
	SEND_ORDER = 'SEND_ORDER',
	PRINT = 'PRINT',
	VIEW_PDF = 'VIEW_PDF',
}

export const modals = {
	[EModalType.CREATE_SUPPLIER]: CreateSupplierModal,
	[EModalType.CREATE_PRODUCT]: CreateProductModal,
	[EModalType.SEND_ORDER]: SendOrderModal,
	[EModalType.PRINT]: PrintModal,
	[EModalType.VIEW_PDF]: ViewPDFModal,
};

export interface ModalsState {
	type: EModalType;
	getModal: () => typeof modals[EModalType];
	isOpen: boolean;

	onToggle: (type: EModalType, nextState?: boolean) => void;

	onToggleIsCreatingSupplier: (nextState?: boolean) => void;
	onToggleIsCreatingProduct: (nextState?: boolean) => void;
	onToggleIsSendingOrder: (nextState?: boolean) => void;
	onToggleIsPrinting: (nextState?: boolean) => void;
	onToggleIsViewingPDF: (nextState?: boolean) => void;
}

export const useModalsStore = create<ModalsState>((set, get) => ({
	type: EModalType.CREATE_PRODUCT,
	getModal: () => modals[get().type],
	isOpen: false,

	onToggle: (type, nextState) =>
		set(
			produce((state) => {
				state.type = type;
				state.isOpen =
					typeof nextState === 'boolean'
						? nextState
						: !state.isOpen;
			}),
		),

	onToggleIsCreatingSupplier: (nextState) =>
		get().onToggle(EModalType.CREATE_SUPPLIER, nextState),
	onToggleIsCreatingProduct: (nextState) =>
		get().onToggle(EModalType.CREATE_PRODUCT, nextState),
	onToggleIsSendingOrder: (nextState) =>
		get().onToggle(EModalType.SEND_ORDER, nextState),
	onToggleIsPrinting: (nextState) =>
		get().onToggle(EModalType.PRINT, nextState),
	onToggleIsViewingPDF: (nextState) =>
		get().onToggle(EModalType.VIEW_PDF, nextState),
}));
