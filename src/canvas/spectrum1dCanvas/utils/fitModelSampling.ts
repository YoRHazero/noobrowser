import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasGaussianFitModel,
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import {
	SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
	SPECTRUM_1D_CANVAS_MIN_FIT_SAMPLE_POINTS,
} from "../shared/constants";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";
import { normalizeWaveRange } from "./range";

export function sampleFitModel(
	model: Spectrum1DCanvasFitModel,
	viewRange: Spectrum1DCanvasWaveRange,
	samplePoints = SPECTRUM_1D_CANVAS_DEFAULT_FIT_SAMPLE_POINTS,
): Spectrum1DCanvasSampledPoint[] {
	const range = getOverlappedWaveRange(model.range, viewRange);
	if (!range) {
		return [];
	}

	return model.kind === "linear"
		? sampleLinearFitModel(model, range)
		: sampleGaussianFitModel(model, range, samplePoints);
}

export function sampleFitModelAtWavelength(
	model: Spectrum1DCanvasFitModel,
	wavelengthUm: number,
): Spectrum1DCanvasSampledPoint {
	return {
		wavelengthUm,
		flux:
			model.kind === "linear"
				? sampleLinearFlux(model, wavelengthUm)
				: sampleGaussianFlux(model, wavelengthUm),
	};
}

export function sampleLinearFlux(
	model: Spectrum1DCanvasLinearFitModel,
	wavelengthUm: number,
): number {
	return model.k * (wavelengthUm - model.x0Um) + model.b;
}

export function sampleGaussianFlux(
	model: Spectrum1DCanvasGaussianFitModel,
	wavelengthUm: number,
): number {
	if (!Number.isFinite(model.sigmaUm) || model.sigmaUm === 0) {
		return 0;
	}

	const exponent = -0.5 * ((wavelengthUm - model.muUm) / model.sigmaUm) ** 2;
	return model.amplitude * Math.exp(exponent);
}

function sampleLinearFitModel(
	model: Spectrum1DCanvasLinearFitModel,
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasSampledPoint[] {
	const midpointUm = (range.minUm + range.maxUm) / 2;

	return [range.minUm, midpointUm, range.maxUm].map((wavelengthUm) => ({
		wavelengthUm,
		flux: sampleLinearFlux(model, wavelengthUm),
	}));
}

function sampleGaussianFitModel(
	model: Spectrum1DCanvasGaussianFitModel,
	range: Spectrum1DCanvasWaveRange,
	samplePoints: number,
): Spectrum1DCanvasSampledPoint[] {
	const count = Math.max(
		SPECTRUM_1D_CANVAS_MIN_FIT_SAMPLE_POINTS,
		Math.floor(samplePoints),
	);
	const sampled = new Array<Spectrum1DCanvasSampledPoint>(count);

	for (let index = 0; index < count; index++) {
		const t = count === 1 ? 0 : index / (count - 1);
		const wavelengthUm = range.minUm + t * (range.maxUm - range.minUm);
		sampled[index] = {
			wavelengthUm,
			flux: sampleGaussianFlux(model, wavelengthUm),
		};
	}

	return sampled;
}

function getOverlappedWaveRange(
	left: Spectrum1DCanvasWaveRange,
	right: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasWaveRange | null {
	const normalizedLeft = normalizeWaveRange(left);
	const normalizedRight = normalizeWaveRange(right);
	const minUm = Math.max(normalizedLeft.minUm, normalizedRight.minUm);
	const maxUm = Math.min(normalizedLeft.maxUm, normalizedRight.maxUm);

	return minUm < maxUm ? { minUm, maxUm } : null;
}
