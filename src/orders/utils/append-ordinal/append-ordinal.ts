export const appendOrdinal = (number: number) => {
	const modulusOfTen = number % 10;
	const modulusOfHundred = number % 100;

	if (modulusOfTen === 1 && modulusOfHundred !== 11) {
		return `${number}st`;
	}

	if (modulusOfTen === 2 && modulusOfHundred !== 12) {
		return `${number}nd`;
	}

	if (modulusOfTen === 3 && modulusOfHundred !== 13) {
		return `${number}rd`;
	}

	return `${number}th`;
};
