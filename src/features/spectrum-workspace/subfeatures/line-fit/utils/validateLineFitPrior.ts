import type { FitPrior } from "@/hooks/query/fit/schemas";

export function validateLineFitPrior({
	prior,
	modelId,
	paramName,
	validReferenceParams,
}: {
	prior: FitPrior;
	modelId: number;
	paramName: string;
	validReferenceParams: ReadonlySet<string>;
}): string | null {
	if (prior.type === "Uniform" && !(prior.lower < prior.upper)) {
		return "Uniform lower must be less than upper.";
	}

	if (prior.type === "Normal" && !(prior.sigma > 0)) {
		return "Normal sigma must be greater than 0.";
	}

	if (prior.type === "TruncatedNormal") {
		if (!(prior.sigma > 0)) {
			return "Truncated normal sigma must be greater than 0.";
		}

		if (
			prior.lower !== undefined &&
			prior.upper !== undefined &&
			!(prior.lower < prior.upper)
		) {
			return "Truncated normal lower must be less than upper.";
		}
	}

	if (prior.type === "Deterministic") {
		const refParam = prior.refParam ?? paramName;
		if (prior.refModelId === modelId && refParam === paramName) {
			return "Deterministic prior cannot reference itself.";
		}

		if (!validReferenceParams.has(`${prior.refModelId}:${refParam}`)) {
			return "Reference parameter is not available.";
		}
	}

	return null;
}
