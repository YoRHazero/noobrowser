import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import type { Spectrum2DCanvasCollapseWindow } from "@/canvas/spectrum2dCanvas";
import { getSpectrumWorkspaceWaveInputStep } from "../../../utils";

function clampValue(value: number, min?: number, max?: number): number {
	const minBound = min ?? value;
	const maxBound = max ?? value;
	return Math.min(Math.max(value, minBound), maxBound);
}

function roundValueForInput(value: number, fractionDigits: number): number {
	if (!Number.isFinite(value)) {
		return value;
	}

	return Number(value.toFixed(fractionDigits));
}

function formatDraftValue(value: number, fractionDigits: number): string {
	if (!Number.isFinite(value)) {
		return "";
	}

	const fixed = value.toFixed(fractionDigits);
	if (!fixed.includes(".")) {
		return fixed;
	}

	const trimmed = fixed.replace(/0+$/, "").replace(/\.$/, "");
	return trimmed === "-0" ? "0" : trimmed;
}

function parseDraftValue(value: string): number | null {
	const nextValue = Number(value);
	return Number.isFinite(nextValue) ? nextValue : null;
}

export interface SpectrumWorkspaceHudDraftFieldModel {
	label: string;
	value: string;
	step: number;
	min?: number;
	max?: number;
	onChange: (value: string) => void;
	onBlur: () => void;
	onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function getFieldPrecision(
	field: keyof Pick<
		Spectrum2DCanvasCollapseWindow,
		"waveMinUm" | "waveMaxUm" | "spatialMin" | "spatialMax"
	>,
): number {
	return field === "waveMinUm" || field === "waveMaxUm" ? 3 : 0;
}

function createDraftsFromCollapseWindow(
	collapseWindow: Spectrum2DCanvasCollapseWindow,
) {
	return {
		waveMinUm: formatDraftValue(
			collapseWindow.waveMinUm,
			getFieldPrecision("waveMinUm"),
		),
		waveMaxUm: formatDraftValue(
			collapseWindow.waveMaxUm,
			getFieldPrecision("waveMaxUm"),
		),
		spatialMin: formatDraftValue(
			collapseWindow.spatialMin,
			getFieldPrecision("spatialMin"),
		),
		spatialMax: formatDraftValue(
			collapseWindow.spatialMax,
			getFieldPrecision("spatialMax"),
		),
	};
}

function resolveWaveFieldBounds({
	field,
	bounds,
	collapseWindow,
}: {
	field: "waveMinUm" | "waveMaxUm";
	bounds: {
		waveMinUm: number;
		waveMaxUm: number;
	};
	collapseWindow: Spectrum2DCanvasCollapseWindow;
}): { min: number; max: number } {
	const fractionDigits = getFieldPrecision(field);
	const sourceMin = roundValueForInput(bounds.waveMinUm, fractionDigits);
	const sourceMax = roundValueForInput(bounds.waveMaxUm, fractionDigits);

	if (field === "waveMinUm") {
		return {
			min: sourceMin,
			max: roundValueForInput(
				clampValue(collapseWindow.waveMaxUm, sourceMin, sourceMax),
				fractionDigits,
			),
		};
	}

	return {
		min: roundValueForInput(
			clampValue(collapseWindow.waveMinUm, sourceMin, sourceMax),
			fractionDigits,
		),
		max: sourceMax,
	};
}

export function useSpectrumWorkspaceHudExtractionDrafts({
	collapseWindow,
	bounds,
	commitCollapseWindowEdit,
}: {
	collapseWindow: Spectrum2DCanvasCollapseWindow;
	bounds: {
		waveMinUm: number;
		waveMaxUm: number;
		spatialMin: number;
		spatialMax: number;
	};
	commitCollapseWindowEdit: (window: Spectrum2DCanvasCollapseWindow) => void;
}) {
	const [drafts, setDrafts] = useState(() =>
		createDraftsFromCollapseWindow(collapseWindow),
	);
	const waveStep = getSpectrumWorkspaceWaveInputStep({
		waveMinUm: bounds.waveMinUm,
		waveMaxUm: bounds.waveMaxUm,
	});

	useEffect(() => {
		setDrafts(createDraftsFromCollapseWindow(collapseWindow));
	}, [collapseWindow]);

	const setDraftValue = useCallback(
		(field: keyof typeof drafts, value: string) => {
			setDrafts((current) => ({
				...current,
				[field]: value,
			}));
		},
		[],
	);
	const commitField = useCallback(
		(field: keyof typeof drafts) => {
			const fractionDigits = getFieldPrecision(field);
			const fieldBounds =
				field === "waveMinUm" || field === "waveMaxUm"
					? resolveWaveFieldBounds({
							field,
							bounds,
							collapseWindow,
						})
					: {
							min: roundValueForInput(bounds.spatialMin, fractionDigits),
							max: roundValueForInput(bounds.spatialMax, fractionDigits),
						};
			const parsedValue = parseDraftValue(drafts[field]);
			if (parsedValue === null) {
				setDrafts((current) => ({
					...current,
					[field]: formatDraftValue(collapseWindow[field], fractionDigits),
				}));
				return;
			}

			const clampedValue = roundValueForInput(
				clampValue(parsedValue, fieldBounds.min, fieldBounds.max),
				fractionDigits,
			);
			commitCollapseWindowEdit({
				...collapseWindow,
				[field]: clampedValue,
			});
			setDrafts((current) => ({
				...current,
				[field]: formatDraftValue(clampedValue, fractionDigits),
			}));
		},
		[bounds, collapseWindow, commitCollapseWindowEdit, drafts],
	);
	const createKeyDownHandler = useCallback(
		(field: keyof typeof drafts) =>
			(event: KeyboardEvent<HTMLInputElement>) => {
				if (event.key === "Enter") {
					event.preventDefault();
					commitField(field);
				}

				if (event.key === "Escape") {
					event.preventDefault();
					setDrafts(createDraftsFromCollapseWindow(collapseWindow));
				}
			},
		[collapseWindow, commitField],
	);
	const waveMinBounds = resolveWaveFieldBounds({
		field: "waveMinUm",
		bounds,
		collapseWindow,
	});
	const waveMaxBounds = resolveWaveFieldBounds({
		field: "waveMaxUm",
		bounds,
		collapseWindow,
	});

	return {
		waveMinField: {
			label: "Wave Min",
			value: drafts.waveMinUm,
			step: waveStep,
			min: waveMinBounds.min,
			max: waveMinBounds.max,
			onChange: (value: string) => setDraftValue("waveMinUm", value),
			onBlur: () => commitField("waveMinUm"),
			onKeyDown: createKeyDownHandler("waveMinUm"),
		} satisfies SpectrumWorkspaceHudDraftFieldModel,
		waveMaxField: {
			label: "Wave Max",
			value: drafts.waveMaxUm,
			step: waveStep,
			min: waveMaxBounds.min,
			max: waveMaxBounds.max,
			onChange: (value: string) => setDraftValue("waveMaxUm", value),
			onBlur: () => commitField("waveMaxUm"),
			onKeyDown: createKeyDownHandler("waveMaxUm"),
		} satisfies SpectrumWorkspaceHudDraftFieldModel,
		spatialMinField: {
			label: "Spatial Min",
			value: drafts.spatialMin,
			step: 1,
			min: bounds.spatialMin,
			max: bounds.spatialMax,
			onChange: (value: string) => setDraftValue("spatialMin", value),
			onBlur: () => commitField("spatialMin"),
			onKeyDown: createKeyDownHandler("spatialMin"),
		} satisfies SpectrumWorkspaceHudDraftFieldModel,
		spatialMaxField: {
			label: "Spatial Max",
			value: drafts.spatialMax,
			step: 1,
			min: bounds.spatialMin,
			max: bounds.spatialMax,
			onChange: (value: string) => setDraftValue("spatialMax", value),
			onBlur: () => commitField("spatialMax"),
			onKeyDown: createKeyDownHandler("spatialMax"),
		} satisfies SpectrumWorkspaceHudDraftFieldModel,
	};
}
