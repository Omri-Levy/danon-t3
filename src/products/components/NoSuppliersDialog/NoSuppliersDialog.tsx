import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import AlertDialog from '@radix-ui/react-alert-dialog';
import { locale } from '../../../common/translations';
import { NavLink } from 'react-router-dom';
import { useGetAllProducts } from '../../products.api';
import { FunctionComponent } from 'react';

export const NoSuppliersDialog: FunctionComponent = () => {
	const { supplierNames } = useGetAllSupplierNames();
	const { isLoading } = useGetAllProducts();

	if (isLoading || supplierNames?.length) return null;

	return (
		<AlertDialog.Root defaultOpen open>
			<AlertDialog.Portal>
				<AlertDialog.Overlay />
				<div className={`modal modal-open`} dir={`rtl`}>
					<AlertDialog.Content className={`modal-box`}>
						<AlertDialog.Title className={`font-bold`}>
							{locale.he.attention}
						</AlertDialog.Title>
						<AlertDialog.Description>
							{locale.he.noSuppliers}
						</AlertDialog.Description>
						<div className={`flex justify-end mt-2`}>
							<AlertDialog.Action asChild>
								<NavLink
									to={'/suppliers'}
									className={`btn`}
								>
									{locale.he.navigateToSuppliers}
								</NavLink>
							</AlertDialog.Action>
						</div>
					</AlertDialog.Content>
				</div>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};
