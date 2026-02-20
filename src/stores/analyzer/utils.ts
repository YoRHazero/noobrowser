import type {
	FitGaussianModel,
	FitLinearModel,
	FitModel,
	FitPrior,
	FitRange,
} from "./types";

export function normalizeRange(range: FitRange): FitRange {
	const min = Math.min(range.min, range.max);
	const max = Math.max(range.min, range.max);
	return { min, max };
}

export function isAutoName(name: string, base: "Linear" | "Gaussian"): boolean {
	const re = new RegExp(`^${base} \\d+$`);
	return re.test(name);
}

export function normalizeModels(models: FitModel[]): FitModel[] {
	const linears = models.filter((m) => m.kind === "linear") as FitLinearModel[];
	const gaussians = models.filter(
		(m) => m.kind === "gaussian",
	) as FitGaussianModel[];

	let nextId = 1;
	let linearIndex = 1;
	let gaussianIndex = 1;

	const result: FitModel[] = [];

	for (const m of linears) {
		const id = nextId++;
		const idx = linearIndex++;
		const name = isAutoName(m.name, "Linear") ? `Linear ${idx}` : m.name;
		result.push({
			...m,
			id,
			name,
			kind: "linear",
			range: normalizeRange(m.range),
		});
	}

	for (const m of gaussians) {
		const id = nextId++;
		const idx = gaussianIndex++;
		const name = isAutoName(m.name, "Gaussian") ? `Gaussian ${idx}` : m.name;
		result.push({
			...m,
			id,
			name,
			kind: "gaussian",
			range: normalizeRange(m.range),
		});
	}
	return result;
}

export function updatePriorInModel(
	models: FitModel[],
	modelId: number,
	paramName: string,
	prior: FitPrior | undefined,
): FitModel[] {
	return models.map((model) => {
		if (model.id !== modelId) return model;

		let isValidParam = false;
		if (model.kind === "linear") {
			isValidParam = ["k", "b"].includes(paramName);
		} else if (model.kind === "gaussian") {
			isValidParam = ["amplitude", "mu", "sigma"].includes(paramName);
		}
		if (!isValidParam) return model;

		const currentPriors = model.priors || {};
		let updatedPriors: Record<string, FitPrior> | undefined = {
			...currentPriors,
		};
		if (prior === undefined) {
			delete updatedPriors[paramName];
		} else {
			updatedPriors[paramName] = prior;
		}
		if (Object.keys(updatedPriors).length === 0) {
			updatedPriors = undefined;
		}

		return {
			...model,
			priors: updatedPriors,
		};
	});
}

export function getModelParamValue(
	model: FitModel,
	paramName: string,
): number | undefined {
	switch (model.kind) {
		case "linear": {
			switch (paramName) {
				case "k":
					return model.k;
				case "b":
					return model.b;
				default:
					return undefined;
			}
		}
		case "gaussian": {
			switch (paramName) {
				case "amplitude":
					return model.amplitude;
				case "mu":
					return model.mu;
				case "sigma":
					return model.sigma;
				default:
					return undefined;
			}
		}
		default:
			return undefined;
	}
}
