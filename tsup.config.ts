import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	dts: true,
	sourcemap: true,
	clean: true,
	format: ["cjs", "esm"],
	target: "es2018",
	minify: false,
	splitting: true,
	treeshake: true,
	outDir: "dist",
	esbuildOptions(options) {
		options.banner = {
			js: "/* Corestack UI - built with tsup */",
		};
	},
	external: ["react", "react-dom", "tailwindcss"],
});
