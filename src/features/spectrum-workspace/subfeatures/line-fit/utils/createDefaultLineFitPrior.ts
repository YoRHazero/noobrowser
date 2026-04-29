import type { FitPrior, PriorType } from "@/hooks/query/fit/schemas";

export function createDefaultLineFitPrior({
	type,
	currentValue,
	refModelId,
	refParam,
}: {
	type: PriorType;
	currentValue: number;
	refModelId?: number;
	refParam?: string;
}): FitPrior {
	const finiteValue = Number.isFinite(currentValue) ? currentValue : 0;
	const scale = Math.abs(finiteValue) * 0.1 || 1;

	if (type === "Fixed") {
		return { type, value: finiteValue };
	}

	if (type === "Normal") {
		return { type, mu: finiteValue, sigma: scale };
	}

	if (type === "Uniform") {
		return {
			type,
			lower: finiteValue - scale,
			upper: finiteValue + scale,
		};
	}

	if (type === "TruncatedNormal") {
		return { type, mu: finiteValue, sigma: scale };
	}

	return {
		type,
		mode: "add",
		value: 0,
		refModelId: refModelId ?? -1,
		refParam,
	};
}
