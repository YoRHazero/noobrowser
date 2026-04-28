import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasPoint,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import { countLineFitFittedParameters } from "./countLineFitFittedParameters";
import { filterFiniteFitPoints } from "./filterFiniteFitPoints";
import { resolveFitModelRangeIntersection } from "./resolveFitModelRangeIntersection";
import { sampleCombinedFitModelFlux } from "./sampleCombinedFitModelFlux";

export interface DeterministicLineFitOptions {
	maxIterations?: number;
	tolerance?: number;
}

export type DeterministicLineFitResult =
	| {
			ok: true;
			models: Spectrum1DCanvasFitModel[];
	  }
	| {
			ok: false;
			reason: string;
	  };

type FittedParameterKind = "amplitude" | "b" | "k" | "muUm" | "sigmaUm";

interface FittedParameter {
	modelId: number;
	kind: FittedParameterKind;
}

const DEFAULT_MAX_ITERATIONS = 80;
const DEFAULT_TOLERANCE = 1e-8;
const INITIAL_DAMPING = 1e-3;
const MAX_DAMPING = 1e12;
const MIN_SIGMA_UM = Number.EPSILON;

function hasFiniteFittedParameters(model: Spectrum1DCanvasFitModel): boolean {
	return model.kind === "gaussian"
		? Number.isFinite(model.amplitude) &&
				Number.isFinite(model.muUm) &&
				Number.isFinite(model.sigmaUm)
		: Number.isFinite(model.k) &&
				Number.isFinite(model.b) &&
				Number.isFinite(model.x0Um);
}

function getFittedParameters(
	models: readonly Spectrum1DCanvasFitModel[],
): FittedParameter[] {
	const parameters: FittedParameter[] = [];

	for (const model of models) {
		if (!model.active) {
			continue;
		}

		if (model.kind === "gaussian") {
			parameters.push(
				{ modelId: model.id, kind: "amplitude" },
				{ modelId: model.id, kind: "muUm" },
				{ modelId: model.id, kind: "sigmaUm" },
			);
			continue;
		}

		parameters.push(
			{ modelId: model.id, kind: "k" },
			{ modelId: model.id, kind: "b" },
		);
	}

	return parameters;
}

function getParameterValue(
	models: readonly Spectrum1DCanvasFitModel[],
	parameter: FittedParameter,
): number {
	const model = models.find((candidate) => candidate.id === parameter.modelId);
	if (!model) {
		return Number.NaN;
	}

	if (model.kind === "gaussian") {
		return model[
			parameter.kind as keyof Pick<
				Spectrum1DCanvasGaussianFitModel,
				"amplitude" | "muUm" | "sigmaUm"
			>
		] as number;
	}

	return model[
		parameter.kind as keyof Pick<Spectrum1DCanvasLinearFitModel, "b" | "k">
	] as number;
}

function clampParameterValue(
	value: number,
	parameter: FittedParameter,
	fitWindow: Spectrum1DCanvasWaveRange,
): number {
	if (!Number.isFinite(value)) {
		return Number.NaN;
	}

	if (parameter.kind === "sigmaUm") {
		return Math.max(value, MIN_SIGMA_UM);
	}

	if (parameter.kind === "muUm") {
		return Math.min(Math.max(value, fitWindow.minUm), fitWindow.maxUm);
	}

	return value;
}

function applyParameterValues(
	models: readonly Spectrum1DCanvasFitModel[],
	parameters: readonly FittedParameter[],
	values: readonly number[],
	fitWindow: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasFitModel[] | null {
	const valuesByKey = new Map<string, number>();
	for (let index = 0; index < parameters.length; index += 1) {
		const parameter = parameters[index];
		const value = clampParameterValue(values[index], parameter, fitWindow);
		if (!Number.isFinite(value)) {
			return null;
		}

		valuesByKey.set(`${parameter.modelId}:${parameter.kind}`, value);
	}

	return models.map((model) => {
		if (!model.active) {
			return model;
		}

		if (model.kind === "gaussian") {
			return {
				...model,
				amplitude: valuesByKey.get(`${model.id}:amplitude`) ?? model.amplitude,
				muUm: valuesByKey.get(`${model.id}:muUm`) ?? model.muUm,
				sigmaUm: valuesByKey.get(`${model.id}:sigmaUm`) ?? model.sigmaUm,
			};
		}

		return {
			...model,
			k: valuesByKey.get(`${model.id}:k`) ?? model.k,
			b: valuesByKey.get(`${model.id}:b`) ?? model.b,
		};
	});
}

function calculateResiduals(
	models: readonly Spectrum1DCanvasFitModel[],
	points: readonly Spectrum1DCanvasPoint[],
): number[] | null {
	const residuals: number[] = [];
	const activeModels = models.filter((model) => model.active);

	for (const point of points) {
		const modelFlux = sampleCombinedFitModelFlux(
			activeModels,
			point.wavelengthUm,
		);
		if (!Number.isFinite(modelFlux)) {
			return null;
		}

		const scale =
			Number.isFinite(point.error) && point.error > 0 ? point.error : 1;
		residuals.push((modelFlux - point.flux) / scale);
	}

	return residuals;
}

function sumSquares(values: readonly number[]): number {
	let total = 0;
	for (const value of values) {
		total += value * value;
	}

	return total;
}

function solveLinearSystem(
	matrix: number[][],
	vector: number[],
): number[] | null {
	const size = vector.length;
	const augmented = matrix.map((row, index) => [...row, vector[index]]);

	for (let column = 0; column < size; column += 1) {
		let pivotRow = column;
		let pivotAbs = Math.abs(augmented[column][column]);
		for (let row = column + 1; row < size; row += 1) {
			const candidateAbs = Math.abs(augmented[row][column]);
			if (candidateAbs > pivotAbs) {
				pivotRow = row;
				pivotAbs = candidateAbs;
			}
		}

		if (!Number.isFinite(pivotAbs) || pivotAbs < 1e-20) {
			return null;
		}

		if (pivotRow !== column) {
			const nextRow = augmented[column];
			augmented[column] = augmented[pivotRow];
			augmented[pivotRow] = nextRow;
		}

		const pivot = augmented[column][column];
		for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
			augmented[column][valueIndex] /= pivot;
		}

		for (let row = 0; row < size; row += 1) {
			if (row === column) {
				continue;
			}

			const factor = augmented[row][column];
			if (factor === 0) {
				continue;
			}

			for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
				augmented[row][valueIndex] -= factor * augmented[column][valueIndex];
			}
		}
	}

	const solution = augmented.map((row) => row[size]);
	return solution.every(Number.isFinite) ? solution : null;
}

function buildNormalEquations({
	models,
	points,
	parameters,
	values,
	residuals,
	fitWindow,
	damping,
}: {
	models: readonly Spectrum1DCanvasFitModel[];
	points: readonly Spectrum1DCanvasPoint[];
	parameters: readonly FittedParameter[];
	values: readonly number[];
	residuals: readonly number[];
	fitWindow: Spectrum1DCanvasWaveRange;
	damping: number;
}): { matrix: number[][]; vector: number[] } | null {
	const parameterCount = parameters.length;
	const derivatives: number[][] = Array.from({ length: points.length }, () =>
		Array.from({ length: parameterCount }, () => 0),
	);

	for (
		let parameterIndex = 0;
		parameterIndex < parameterCount;
		parameterIndex += 1
	) {
		const parameter = parameters[parameterIndex];
		const baseValue = values[parameterIndex];
		const stepSize = Math.max(
			1e-8,
			Math.sqrt(Number.EPSILON) * (Math.abs(baseValue) + 1),
		);
		const trialValues = [...values];
		trialValues[parameterIndex] = clampParameterValue(
			baseValue + stepSize,
			parameter,
			fitWindow,
		);
		const actualStep = trialValues[parameterIndex] - baseValue;
		if (!Number.isFinite(actualStep) || actualStep === 0) {
			return null;
		}

		const trialModels = applyParameterValues(
			models,
			parameters,
			trialValues,
			fitWindow,
		);
		if (trialModels === null) {
			return null;
		}

		const trialResiduals = calculateResiduals(trialModels, points);
		if (trialResiduals === null) {
			return null;
		}

		for (let pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
			derivatives[pointIndex][parameterIndex] =
				(trialResiduals[pointIndex] - residuals[pointIndex]) / actualStep;
		}
	}

	const matrix: number[][] = Array.from({ length: parameterCount }, () =>
		Array.from({ length: parameterCount }, () => 0),
	);
	const vector = Array.from({ length: parameterCount }, () => 0);

	for (let row = 0; row < points.length; row += 1) {
		for (let column = 0; column < parameterCount; column += 1) {
			const derivative = derivatives[row][column];
			vector[column] -= derivative * residuals[row];
			for (let inner = column; inner < parameterCount; inner += 1) {
				matrix[column][inner] += derivative * derivatives[row][inner];
			}
		}
	}

	for (let row = 0; row < parameterCount; row += 1) {
		for (let column = 0; column < row; column += 1) {
			matrix[row][column] = matrix[column][row];
		}

		const diagonal = matrix[row][row];
		matrix[row][row] += damping * (diagonal > 0 ? diagonal : 1);
	}

	return { matrix, vector };
}

export function runDeterministicLineFit({
	models,
	points,
	options = {},
}: {
	models: readonly Spectrum1DCanvasFitModel[];
	points: readonly Spectrum1DCanvasPoint[];
	options?: DeterministicLineFitOptions;
}): DeterministicLineFitResult {
	const fitWindow = resolveFitModelRangeIntersection(models);
	if (fitWindow === null) {
		return { ok: false, reason: "No valid fit window." };
	}

	const filteredPoints = filterFiniteFitPoints(points, fitWindow);
	const parameterCount = countLineFitFittedParameters(models);
	if (parameterCount === 0) {
		return { ok: false, reason: "No active models to fit." };
	}

	if (filteredPoints.length < parameterCount) {
		return { ok: false, reason: "Not enough valid points to fit." };
	}

	if (
		!models.every((model) => !model.active || hasFiniteFittedParameters(model))
	) {
		return { ok: false, reason: "Fit models contain invalid parameters." };
	}

	const parameters = getFittedParameters(models);
	let values = parameters.map((parameter) =>
		clampParameterValue(
			getParameterValue(models, parameter),
			parameter,
			fitWindow,
		),
	);
	let currentModels = applyParameterValues(
		models,
		parameters,
		values,
		fitWindow,
	);
	if (currentModels === null) {
		return { ok: false, reason: "Fit models contain invalid parameters." };
	}

	let residuals = calculateResiduals(currentModels, filteredPoints);
	if (residuals === null) {
		return { ok: false, reason: "Could not evaluate fit models." };
	}

	let currentSse = sumSquares(residuals);
	if (!Number.isFinite(currentSse)) {
		return { ok: false, reason: "Could not evaluate fit error." };
	}

	const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
	const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
	let damping = INITIAL_DAMPING;

	for (let iteration = 0; iteration < maxIterations; iteration += 1) {
		const equations = buildNormalEquations({
			models: currentModels,
			points: filteredPoints,
			parameters,
			values,
			residuals,
			fitWindow,
			damping,
		});
		if (equations === null) {
			return { ok: false, reason: "Could not solve fit step." };
		}

		const delta = solveLinearSystem(equations.matrix, equations.vector);
		if (delta === null) {
			damping *= 10;
			if (damping > MAX_DAMPING) {
				return { ok: false, reason: "Could not solve fit step." };
			}
			continue;
		}

		const trialValues = values.map((value, index) =>
			clampParameterValue(value + delta[index], parameters[index], fitWindow),
		);
		if (!trialValues.every(Number.isFinite)) {
			damping *= 10;
			continue;
		}

		const trialModels = applyParameterValues(
			currentModels,
			parameters,
			trialValues,
			fitWindow,
		);
		if (trialModels === null) {
			damping *= 10;
			continue;
		}

		const trialResiduals = calculateResiduals(trialModels, filteredPoints);
		if (trialResiduals === null) {
			damping *= 10;
			continue;
		}

		const trialSse = sumSquares(trialResiduals);
		if (!Number.isFinite(trialSse) || trialSse >= currentSse) {
			damping *= 10;
			if (damping > MAX_DAMPING) {
				break;
			}
			continue;
		}

		const relativeImprovement =
			(currentSse - trialSse) / Math.max(1, currentSse);
		values = trialValues;
		currentModels = trialModels;
		residuals = trialResiduals;
		currentSse = trialSse;
		damping = Math.max(damping / 10, 1e-12);

		if (relativeImprovement < tolerance) {
			break;
		}
	}

	return { ok: true, models: currentModels };
}
