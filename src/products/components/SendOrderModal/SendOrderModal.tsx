import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useSendOrderModal } from './hooks/useSendOrderModal/useSendOrderModal';
import { Form } from '../../../common/components/molecules/Form/Form';

export const SendOrderModal: FunctionComponent = () => {
	const {
		isOpen,
		onToggleIsSendingOrder,
		products,
		base64,
		sendOrderMethods,
		onSendOrderSubmit,
		isLoading,
	} = useSendOrderModal();

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsSendingOrder}
			title={locale.he.order}
			contentProps={{
				className: `2xl:w-6/12 max-w-[70%] h-full
max-h-960px:p-2 max-h-960px:max-h-[calc(100%-0.5em)]`,
			}}
		>
			{!!products?.length && (
				<iframe
					src={base64?.toString()}
					className={`w-full h-full max-h-[86%]`}
				/>
			)}
			<Form
				methods={sendOrderMethods}
				onSubmit={onSendOrderSubmit}
			>
				<Form.SubmitButton
					className={clsx([
						`btn mt-2 mr-auto gap-2`,
						{ loading: isLoading },
					])}
					disabled={isLoading}
					type={`submit`}
				>
					{locale.he.send}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
					>
						<path d='M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z' />
					</svg>
				</Form.SubmitButton>
			</Form>
		</Modal>
	);
};
