import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";

export function getLineFitParameterValue(
	model: Spectrum1DCanvasFitModel,
	paramName: string,
): number | null {
	if (model.kind === "gaussian") {
		if (paramName === "amplitude") {
			return model.amplitude;
		}

		if (paramName === "mu") {
			return model.muUm;
		}

		if (paramName === "sigma") {
			return model.sigmaUm;
		}

		return null;
	}

	if (paramName === "k") {
		return model.k;
	}

	if (paramName === "b") {
		return model.b;
	}

	return null;
}
