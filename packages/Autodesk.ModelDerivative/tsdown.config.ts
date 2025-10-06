import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./index.ts",
	platform: "neutral",
	outDir: "../../_dist/packages/Autodesk.ModelDerivative",
	clean: true,
	dts: true,
	target: "node18",
});
