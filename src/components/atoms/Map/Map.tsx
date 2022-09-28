import { Fragment, PropsWithChildren, ReactNode } from 'react';

export const Map = <TItems extends Array<any>>({
	items,
	render,
}: PropsWithChildren & {
	items: TItems;
	render: (item: TItems[number], index: number) => ReactNode;
}) => {
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
