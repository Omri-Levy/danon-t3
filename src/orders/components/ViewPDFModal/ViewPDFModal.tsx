import { locale } from '../../../common/translations';
import { FunctionComponent, useCallback } from 'react';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import {
	EModalType,
	useModalsStore,
} from '../../../common/stores/modals/modals';
import { useGetOrderPresignedUrlById } from '../../orders.api';
import {
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

export const ViewPDFModal: FunctionComponent = () => {
	const { isOpen, onToggleIsViewingPDF, type } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsViewingPDF: state.onToggleIsViewingPDF,
			type: state.type,
		}),
	);
	const { orderId = '' } = useParams();
	const { data: presignedUrl } = useGetOrderPresignedUrlById({
		id: orderId,
		enabled: !!orderId && isOpen && type === EModalType.VIEW_PDF,
	});
	const navigate = useNavigate();
	const location = useLocation();
	// Remove the order id param from the url when closing the modal
	const onToggle = useCallback(
		(nextState?: boolean) => {
			onToggleIsViewingPDF(nextState);

			if (nextState) return;

			navigate(`/orders${location.search}`);
		},
		[onToggleIsViewingPDF, navigate, location.search],
	);

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggle}
			contentProps={{
				className: `2xl:w-6/12 max-w-[70%] h-full max-h-960px:p-2 max-h-960px:max-h-[calc(100%-0.5em)]`,
			}}
			title={locale.he.order}
		>
			<iframe
				className={`w-full h-full max-h-[calc(100%-3em)]`}
				src={presignedUrl}
			/>
		</Modal>
	);
};
