import { FunctionComponent } from 'react';
import { useSelectSupplier } from './hooks/useSelectSupplier/useSelectSupplier';
import { locale } from '../../../translations';

export const SelectSupplier: FunctionComponent = () => {
	const { supplierNames, supplier, onUpdateSupplier } =
		useSelectSupplier();

	return (
		<div>
			<label className={`label block text-right`}>
				<span className={`label-text`}>
					{locale.he.supplier}
				</span>
			</label>
			<select
				className='select select-bordered'
				value={supplier ?? supplierNames?.[0]}
				onChange={onUpdateSupplier}
			>
				{supplierNames?.map((o) => (
					<option
						key={`${o}-select-option`}
						disabled={supplier === o}
					>
						{o}
					</option>
				))}
			</select>
		</div>
	);
};
