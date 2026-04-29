import type {
	FitBodyRequest,
	FitConfiguration,
} from "@/hooks/query/fit/schemas";

function isFiniteNumber(value: number | null | undefined): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function resolveGroupId(value: string | null | undefined): number | null {
	if (!value) {
		return null;
	}

	const parsedValue = Number(value);
	return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function createLineFitJobBody({
	source,
	fit,
}: {
	source: {
		id: string;
		position: {
			ra: number | null;
			dec: number | null;
			x: number | null;
			y: number | null;
		};
		imageRef: {
			refBasename: string | null;
			footprintId: string | null;
		};
		z: number | null;
		spectrum: {
			extractionParams: {
				apertureSize: number;
				waveMinUm: number;
				waveMaxUm: number;
			} | null;
		};
	};
	fit: FitConfiguration[];
}): FitBodyRequest | null {
	const extractionParams = source.spectrum.extractionParams;
	if (!extractionParams || fit.length === 0) {
		return null;
	}

	const { apertureSize, waveMinUm, waveMaxUm } = extractionParams;
	if (
		!Number.isFinite(apertureSize) ||
		!Number.isFinite(waveMinUm) ||
		!Number.isFinite(waveMaxUm)
	) {
		return null;
	}

	return {
		extraction: {
			extraction_config: {
				aperture_size: apertureSize,
				wavelength_range: {
					min: Math.min(waveMinUm, waveMaxUm),
					max: Math.max(waveMinUm, waveMaxUm),
				},
			},
			source_meta: {
				source_id: source.id,
				...(isFiniteNumber(source.position.ra)
					? { ra: source.position.ra }
					: {}),
				...(isFiniteNumber(source.position.dec)
					? { dec: source.position.dec }
					: {}),
				...(isFiniteNumber(source.position.x) ? { x: source.position.x } : {}),
				...(isFiniteNumber(source.position.y) ? { y: source.position.y } : {}),
				...(source.imageRef.refBasename
					? { ref_basename: source.imageRef.refBasename }
					: {}),
				...(isFiniteNumber(source.z) ? { z: source.z } : {}),
				group_id: resolveGroupId(source.imageRef.footprintId),
			},
		},
		fit,
	};
}
