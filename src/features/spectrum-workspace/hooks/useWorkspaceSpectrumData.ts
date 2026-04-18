"use client";

import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useExtractSpectrum } from "@/hooks/query/source/useExtractSpectrum";
import type { Source } from "@/stores/source";

export interface SpectrumWorkspaceDataReadyResult {
	state: "ready";
	extractedSpectrum: ExtractedSpectrum;
}

export interface SpectrumWorkspaceDataMessageResult {
	state:
		| "no-source"
		| "spectrum-idle"
		| "spectrum-committed"
		| "spectrum-pending"
		| "spectrum-error"
		| "spectrum-uncovered"
		| "spectrum-missing";
	message: string;
	detail?: string;
}

export type UseWorkspaceSpectrumDataResult =
	| SpectrumWorkspaceDataReadyResult
	| SpectrumWorkspaceDataMessageResult;

function isFiniteNumber(value: number | null | undefined): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function getSpectrumMessage(
	source: Source,
): SpectrumWorkspaceDataMessageResult {
	switch (source.spectrum.status) {
		case "idle":
			return {
				state: "spectrum-idle",
				message: "Spectrum is not available.",
				detail: "Fetch a spectrum for the active source.",
			};
		case "committed":
			return {
				state: "spectrum-committed",
				message: "Spectrum extraction is queued.",
			};
		case "pending":
			return {
				state: "spectrum-pending",
				message: "Spectrum extraction is running.",
			};
		case "error":
			return {
				state: "spectrum-error",
				message: "Spectrum extraction failed.",
			};
		case "uncovered":
			return {
				state: "spectrum-uncovered",
				message: "Active source is outside the available footprint.",
			};
		case "ready":
			return {
				state: "spectrum-missing",
				message: "Spectrum data is not available.",
			};
	}
}

export function useWorkspaceSpectrumData({
	source,
}: {
	source: Source | null;
}): UseWorkspaceSpectrumDataResult {
	const extractionParams = source?.spectrum.extractionParams ?? null;
	const targetRa = isFiniteNumber(source?.position.ra)
		? source.position.ra
		: undefined;
	const targetDec = isFiniteNumber(source?.position.dec)
		? source.position.dec
		: undefined;
	const hasSpectrumTarget =
		source !== null &&
		extractionParams !== null &&
		targetRa !== undefined &&
		targetDec !== undefined;
	const spectrumQuery = useExtractSpectrum({
		selectedFootprintId: source?.imageRef.footprintId,
		waveMin: extractionParams?.waveMinUm ?? 0,
		waveMax: extractionParams?.waveMaxUm ?? 0,
		apertureSize: extractionParams?.apertureSize ?? 0,
		ra: hasSpectrumTarget ? targetRa : undefined,
		dec: hasSpectrumTarget ? targetDec : undefined,
		enabled: false,
	});

	if (source === null) {
		return {
			state: "no-source",
			message: "No active source.",
			detail: "Select a source in Target Hub.",
		};
	}

	if (source.spectrum.status !== "ready") {
		return getSpectrumMessage(source);
	}

	const extractedSpectrum = spectrumQuery.data;
	if (!extractedSpectrum) {
		return {
			state: "spectrum-missing",
			message: "Spectrum data is not available.",
		};
	}

	if (!extractedSpectrum.covered) {
		return {
			state: "spectrum-uncovered",
			message: "Active source is outside the available footprint.",
		};
	}

	const width = extractedSpectrum.wavelength.length;
	const height = extractedSpectrum.spectrum_2d.length;
	if (width === 0 || height === 0) {
		return {
			state: "spectrum-missing",
			message: "Spectrum data is not available.",
		};
	}

	return {
		state: "ready",
		extractedSpectrum,
	};
}
