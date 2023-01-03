export const reverseIfHebrew = (str: string) => {
	if (typeof str !== 'string') return str;

	const isHebrew = /[\u0590-\u05FF]/;
	const words = str.split(' ');

	if (words.every((word) => isHebrew.test(word))) {
		return words
			.map((word) =>
				isHebrew.test(word)
					? word.split('').reverse().join('')
					: word,
			)
			.reverse()
			.join(' ');
	}

	return words.join(' ');
};
