import { Fragment, PropsWithChildren } from 'react';
import { IMapProps } from './interfaces';
import { TAnyArray } from '../../../types';

export const Map = <TItems extends TAnyArray>({
	items,
	render,
}: PropsWithChildren<IMapProps<TItems>>) => {
	const noItems = !items?.length;
	const itemsNotArray = !Array.isArray(items);

	if (noItems || itemsNotArray) return null;

	return (
		<>
			{items.map((item, index) => (
				<Fragment key={item.id ?? index}>
					{render(item, index)}
				</Fragment>
			))}
		</>
	);
};
/*  */