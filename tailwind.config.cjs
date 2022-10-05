const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				'max-h-960px': {'raw': '(max-height: 960px)'},
				...defaultTheme.screens,
			}
		},
	},
	plugins: [require('daisyui')],
};
