import { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';

export const ReactPdfTable: FunctionComponent<{
	headers: Array<{
		accessorKey: string;
		header: string;
		styles?: Style;
	}>;
	data: Array<any>;
}> = ({ headers, data }) => {
	const styles = StyleSheet.create({
		table: {
			border: `1px solid black`,
		},
		tr: {
			flexDirection: 'row',
		},
		thead: {
			flexDirection: 'row',
			borderBottom: `1px solid black`,
		},
		td: {
			padding: '5px',
			justifyContent: 'center',
		},
		th: {
			textAlign: 'center',
			padding: '5px',
			fontWeight: 'bold',
		},
	});

	return (
		<View style={styles.table}>
			<View style={styles.thead}>
				{headers?.map(
					(
						{ header, styles: stylesProp, accessorKey },
						index,
					) => (
						<Text
							key={`${accessorKey ?? index}-th`}
							style={{
								...styles.th,
								width: `${100 / headers.length}%`,
								borderRight:
									index === headers.length - 1
										? 'none'
										: '1px solid black',
								...stylesProp,
							}}
						>
							{header}
						</Text>
					),
				)}
			</View>
			{data?.map((item, index) => (
				<View
					key={`${item?.id ?? index}-tr`}
					style={{
						...styles.tr,
						borderBottom:
							index === data.length - 1
								? 'none'
								: '1px solid black',
					}}
				>
					{headers?.map(
						(
							{ accessorKey, styles: stylesProp },
							index,
						) => {
							const keys = accessorKey.split('.');
							let value = item;

							keys.forEach((key) => {
								value = value[key];
							});

							return (
								<View
									key={`${accessorKey ?? index}-td`}
									style={{
										...styles.td,
										width: `${
											100 / headers.length
										}%`,
										borderRight:
											index ===
											headers.length - 1
												? 'none'
												: '1px solid black',
										...stylesProp,
									}}
								>
									<Text>{value}</Text>
								</View>
							);
						},
					)}
				</View>
			))}
		</View>
	);
};
