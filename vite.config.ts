import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { threeMinifier } from "@yushijinhun/three-minifier-rollup";

export default defineConfig({
	plugins: [{ ...threeMinifier(), enforce: "pre" }, sveltekit()],
	ssr: {
		noExternal: ['three']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
