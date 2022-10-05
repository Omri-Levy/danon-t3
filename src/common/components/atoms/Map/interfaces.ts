import { ReactNode } from 'react';
import { TAnyArray } from '../../../types';

export interface IMapProps<TItems extends TAnyArray> {
	items: TItems;
	render: (
		item: TItems[number],
		index: number,
	) => ReactNode | undefined;
}
