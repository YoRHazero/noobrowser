import type {
    FitGaussianModel,
    FitLinearModel,
    FitModel,
    FitPrior,
    FitRange,
} from "./stores-types";

/* -------------------------------------------------------------------------- */
/*                                Source-utils                                */
/* -------------------------------------------------------------------------- */

/** 
 * Generate a distinct color based on the given index.
 * Uses the golden angle to ensure good distribution.
 * @param index - The index to generate the color for.
 * @returns A string representing the color in HSL format.
 */
export function generateColor(index: number): string {
    const angle = index * 137.508; // degrees
    const hue = angle % 360;
    return `hsl(${hue}, 85%, 60%)`;
}

/* -------------------------------------------------------------------------- */
/*                                  Fit-utils                                 */
/* -------------------------------------------------------------------------- */

/**
 * Normalize:
 * - ensure min <= max
 * @param range The range to normalize.
 * @returns The normalized range with min and max properly ordered.
 */
export function normalizeRange(range: FitRange): FitRange {
    const min = Math.min(range.min, range.max);
    const max = Math.max(range.min, range.max);
    return { min, max };
}


/**
 * Determine if the given name is an auto-generated name based on the base type.
 * @param name The name to check.
 * @param base The base type, either "Linear" or "Gaussian".
 * @returns True if the name is auto-generated, false otherwise.
 */
export function isAutoName(name: string, base: "Linear" | "Gaussian"): boolean {
    const re = new RegExp(`^${base} \\d+$`);
    return re.test(name);
}

/**
 * Normalize:
 * - linear models first, then gaussian models
 * - reassign id as 1..N
 * - auto rename "Linear N" / "Gaussian N"
 * - custom names stay untouched
 */
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
        let updatedPriors: Record<string, FitPrior> | undefined = { ...currentPriors };
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