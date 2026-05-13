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

const DEFAULT_MCMC_APERTURE_SIZE = 5;
const DEFAULT_MCMC_OFFSET = 0;
const DEFAULT_MCMC_EXTRACT_MODE = "GRISMR";

export function createLineFitJobBody({
	source,
	fit,
	jobSettings,
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
	};
	fit: FitConfiguration[];
	jobSettings?: {
		apertureSize?: number;
		offset?: number;
		extractMode?: "GRISMR" | "GRISMC";
	};
}): FitBodyRequest | null {
	if (fit.length === 0) {
		return null;
	}

	const apertureSize = jobSettings?.apertureSize ?? DEFAULT_MCMC_APERTURE_SIZE;
	const offset = jobSettings?.offset ?? DEFAULT_MCMC_OFFSET;
	const extractMode = jobSettings?.extractMode ?? DEFAULT_MCMC_EXTRACT_MODE;
	if (
		!Number.isFinite(apertureSize) ||
		apertureSize <= 0 ||
		!Number.isFinite(offset)
	) {
		return null;
	}

	return {
		extraction: {
			extraction_config: {
				aperture_size: apertureSize,
				offset,
				extract_mode: extractMode,
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
