const {z} = require("zod");
const {kebabCase} = require("lodash");
const {
	prefix,
	transformer,
	separator,
	...rest
} =
	/** @type {import('@branchlint/cli').TBranchlintConfig} */
	require('@branchlint/default-config');

/** @type {import('@branchlint/cli').TBranchlintConfig} */
module.exports = {
	...rest,
	separator,
	prefix: {
		...prefix,
		message: 'What is the issue\'s number?',
		name: 'issueNumber',
		validate: (value) => {
			const result = z.preprocess((v) => {
				const parsed = Number(v);

				return isNaN(parsed) ? v : parsed;
			}, z.number()).safeParse(value);

			if (!result.success) {
				return result.error.format()._errors.join('\n');
			}

			return true;
		},
	},
	transformer: ({answers}) => {
		const {issueNumber, ...rest} = answers;

		return [
			`DANON-${issueNumber}`,
			...Object.values(rest)
				.map(kebabCase)
		]
			.join(separator);
	},
};
