import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";

export function getLineFitPriorParameters(
	model: Spectrum1DCanvasFitModel,
): string[] {
	return model.kind === "gaussian" ? ["amplitude", "mu", "sigma"] : ["k", "b"];
}
