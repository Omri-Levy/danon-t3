import currency from 'currency.js';

export const toShekels = (value: number | string) =>
	currency(value, {
		separator: ',',
		decimal: '.',
		precision: 2,
		symbol: '₪',
	}).format();
