import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { IViewPDFProps } from './interfaces';

export const ViewPDF: FunctionComponent<IViewPDFProps> = ({
	presignedUrl,
	isOpen,
	onOpen,
}) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<div
						className={clsx([
							`modal`,
							{
								[`modal-open`]: isOpen,
							},
						])}
					>
						<Dialog.Content
							className={`modal-box 2xl:w-6/12 max-w-[70%] h-full
							 max-h-960px:p-2 max-h-960px:max-h-[calc(100%-0.5em)]`}
						>
							<div className={`flex justify-end`}>
								<Dialog.Close>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='w-6 h-6'
									>
										<path
											fillRule='evenodd'
											d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
											clipRule='evenodd'
										/>
									</svg>
								</Dialog.Close>
							</div>
							<Dialog.Title
								dir={`rtl`}
								className={`font-bold text-center`}
							>
								{locale.he.order}
							</Dialog.Title>
							<iframe
								className={`w-full h-full max-h-[600px]`}
								src={presignedUrl}
							/>
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};