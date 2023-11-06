/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		fontFamily: {
			'sans': ['bahnschrift'],
			'display': ['schabo_condensed'],
		}
	},
	plugins: [
		require('tailwindcss-3d')
	],
}
