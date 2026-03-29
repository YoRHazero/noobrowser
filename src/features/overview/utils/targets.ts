import { v4 as uuidv4 } from "uuid";
import type { OverviewManualTarget } from "@/stores/overview";

export interface OverviewTargetDraftFields {
	raInput: string;
	decInput: string;
}

export interface ParsedOverviewTargetCoordinate {
	ra: number;
	dec: number;
}

export interface OverviewTargetDraftValidationResult {
	parsedCoordinate: ParsedOverviewTargetCoordinate | null;
	raError: string | null;
	decError: string | null;
}

function parseCoordinateInput(value: string): number | null {
	const trimmed = value.trim();

	if (trimmed.length === 0) {
		return null;
	}

	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeRaDegrees(ra: number) {
	return ((ra % 360) + 360) % 360;
}

export function parseOverviewTargetDraft({
	raInput,
	decInput,
}: OverviewTargetDraftFields): ParsedOverviewTargetCoordinate | null {
	const ra = parseCoordinateInput(raInput);
	const dec = parseCoordinateInput(decInput);

	if (ra === null || dec === null) {
		return null;
	}

	if (dec < -90 || dec > 90) {
		return null;
	}

	return {
		ra: normalizeRaDegrees(ra),
		dec,
	};
}

export function validateOverviewTargetDraft({
	raInput,
	decInput,
}: OverviewTargetDraftFields): OverviewTargetDraftValidationResult {
	const parsedRa = parseCoordinateInput(raInput);
	const parsedDec = parseCoordinateInput(decInput);

	const raError =
		raInput.trim().length === 0
			? "RA is required."
			: parsedRa === null
				? "RA must be a valid number."
				: null;
	const decError =
		decInput.trim().length === 0
			? "Dec is required."
			: parsedDec === null
				? "Dec must be a valid number."
				: parsedDec < -90 || parsedDec > 90
					? "Dec must be between -90 and 90."
					: null;

	if (raError || decError || parsedRa === null || parsedDec === null) {
		return {
			parsedCoordinate: null,
			raError,
			decError,
		};
	}

	return {
		parsedCoordinate: {
			ra: normalizeRaDegrees(parsedRa),
			dec: parsedDec,
		},
		raError: null,
		decError: null,
	};
}

export function buildOverviewManualTarget(params: {
	labelInput: string;
	coordinate: ParsedOverviewTargetCoordinate;
	nextTargetSequence: number;
}): OverviewManualTarget {
	const label = params.labelInput.trim() || `Target ${params.nextTargetSequence}`;

	return {
		id: uuidv4(),
		label,
		ra: params.coordinate.ra,
		dec: params.coordinate.dec,
		createdAt: new Date().toISOString(),
	};
}
