import create from 'zustand';
import produce from 'immer';
import { CreateProductModal } from '../../../products/components/CreateProductModal/CreateProductModal';
import { CreateSupplierModal } from '../../../suppliers/components/CreateSupplierModal/CreateSupplierModal';
import { SendOrderModal } from '../../../products/components/SendOrderModal/SendOrderModal';
import { ViewPDFModal } from '../../../orders/components/ViewPDFModal/ViewPDFModal';
import { DeleteSelectedProductsModal } from '../../../products/components/DeleteSelectedProductsModal/DeleteSelectedProductsModal';
import { DeleteSelectedSuppliersModal } from '../../../suppliers/components/DeleteSelectedSuppliersModal/DeleteSelectedSuppliersModal';
import { DeleteSelectedOrdersModal } from '../../../orders/components/DeleteSelectedOrdersModal/DeleteSelectedOrdersModal';
import { PrintStockModal } from '../../../stock/components/PrintStockModal/PrintStockModal';

export enum EModalType {
	CREATE_SUPPLIER = 'EDIT_PRODUCT',
	DELETE_SELECTED_SUPPLIERS = 'DELETE_SELECTED_SUPPLIERS',
	CREATE_PRODUCT = 'CREATE_PRODUCT',
	DELETE_SELECTED_PRODUCTS = 'DELETE_SELECTED_PRODUCTS',
	SEND_ORDER = 'SEND_ORDER',
	PRINT_STOCK = 'PRINT_STOCK',
	VIEW_PDF = 'VIEW_PDF',
	DELETE_SELECTED_ORDERS = 'DELETE_SELECTED_ORDERS',
}

export const modals = {
	[EModalType.CREATE_SUPPLIER]: CreateSupplierModal,
	[EModalType.DELETE_SELECTED_SUPPLIERS]:
		DeleteSelectedSuppliersModal,
	[EModalType.CREATE_PRODUCT]: CreateProductModal,
	[EModalType.DELETE_SELECTED_PRODUCTS]:
		DeleteSelectedProductsModal,
	[EModalType.SEND_ORDER]: SendOrderModal,
	[EModalType.PRINT_STOCK]: PrintStockModal,
	[EModalType.VIEW_PDF]: ViewPDFModal,
	[EModalType.DELETE_SELECTED_ORDERS]: DeleteSelectedOrdersModal,
};

export interface ModalsState {
	type: EModalType;
	getModal: () => typeof modals[EModalType];
	isOpen: boolean;

	onToggle: (type: EModalType, nextState?: boolean) => void;

	onToggleIsCreatingSupplier: (nextState?: boolean) => void;
	onToggleIsDeletingSelectedSuppliers: (
		nextState?: boolean,
	) => void;
	onToggleIsCreatingProduct: (nextState?: boolean) => void;
	onToggleIsDeletingSelectedProducts: (nextState?: boolean) => void;
	onToggleIsSendingOrder: (nextState?: boolean) => void;
	onToggleIsPrintingStock: (nextState?: boolean) => void;
	onToggleIsViewingPDF: (nextState?: boolean) => void;
	onToggleIsDeletingSelectedOrders: (nextState?: boolean) => void;
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
	onToggleIsDeletingSelectedSuppliers: (nextState) =>
		get().onToggle(
			EModalType.DELETE_SELECTED_SUPPLIERS,
			nextState,
		),
	onToggleIsCreatingProduct: (nextState) =>
		get().onToggle(EModalType.CREATE_PRODUCT, nextState),
	onToggleIsDeletingSelectedProducts: (nextState) =>
		get().onToggle(
			EModalType.DELETE_SELECTED_PRODUCTS,
			nextState,
		),
	onToggleIsSendingOrder: (nextState) =>
		get().onToggle(EModalType.SEND_ORDER, nextState),
	onToggleIsPrintingStock: (nextState) =>
		get().onToggle(EModalType.PRINT_STOCK, nextState),
	onToggleIsViewingPDF: (nextState) =>
		get().onToggle(EModalType.VIEW_PDF, nextState),
	onToggleIsDeletingSelectedOrders: (nextState) =>
		get().onToggle(EModalType.DELETE_SELECTED_ORDERS, nextState),
}));
