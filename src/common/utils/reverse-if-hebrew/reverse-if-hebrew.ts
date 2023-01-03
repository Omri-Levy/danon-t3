export const reverseIfHebrew = (str: string) => {
	const isHebrew = /[\u0590-\u05FF]/;

	if (!isHebrew.test(str)) return str;

	return str.split('').reverse().join('');
};
