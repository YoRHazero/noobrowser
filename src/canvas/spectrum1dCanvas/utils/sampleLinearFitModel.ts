import type {
	Spectrum1DCanvasLinearFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import type { Spectrum1DCanvasSampledPoint } from "../shared/types";
import { sampleLinearFlux } from "./sampleLinearFlux";

export function sampleLinearFitModel(
	model: Spectrum1DCanvasLinearFitModel,
	range: Spectrum1DCanvasWaveRange,
): Spectrum1DCanvasSampledPoint[] {
	const midpointUm = (range.minUm + range.maxUm) / 2;

	return [range.minUm, midpointUm, range.maxUm].map((wavelengthUm) => ({
		wavelengthUm,
		flux: sampleLinearFlux(model, wavelengthUm),
	}));
}
