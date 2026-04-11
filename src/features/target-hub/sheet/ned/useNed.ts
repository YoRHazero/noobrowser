"use client";

import { type MouseEvent, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";
import { useSourceStore } from "@/stores/source";
import { useEditorStore } from "../store/useEditorStore";
import { useNedStore } from "./store/useNedStore";

export type NedRadiusUnit = "degree" | "arcminute" | "arcsecond";
export type NedPanelMode = "results" | "settings";

const NED_MAX_RADIUS_ARCSEC = 36000;
const NED_RADIUS_EPSILON = 1e-9;

interface NedDraftState {
	value: string;
	unit: NedRadiusUnit;
}

export interface NedSettingsModel {
	draftValue: string;
	draftUnit: NedRadiusUnit;
	canSave: boolean;
	saveDisabledReason: string | null;
	canRefetch: boolean;
	refetchDisabledReason: string | null;
	onDraftValueChange: (value: string) => void;
	onDraftUnitChange: (unit: NedRadiusUnit) => void;
	onSave: () => void;
	onRefetch: () => void;
}

export interface NedResultsModel {
	isFetching: boolean;
	isSuccess: boolean;
	isError: boolean;
	errorMessage: string | null;
	results: Array<{
		objectName: string;
		ra: number;
		dec: number;
		redshift: number | null;
		url: string;
	}>;
}

export interface NedTriggerModel {
	disabled: boolean;
	loading: boolean;
	tooltip: string;
	isHighlighted: boolean;
	isErrorHighlighted: boolean;
	onClick: () => void;
	onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface NedViewModel {
	isOpen: boolean;
	mode: NedPanelMode;
	onOpenChange: (open: boolean) => void;
	trigger: NedTriggerModel;
	settings: NedSettingsModel;
	results: NedResultsModel;
	hasCoordinates: boolean;
}

const UNIT_OPTIONS: Record<NedRadiusUnit, number> = {
	degree: 3600,
	arcminute: 60,
	arcsecond: 1,
};

export function useNed(): NedViewModel {
	const { editorMode } = useEditorStore(
		useShallow((state) => ({
			editorMode: state.editorMode,
		})),
	);
	const { activeSourceId, sources } = useSourceStore(
		useShallow((state) => ({
			activeSourceId: state.activeSourceId,
			sources: state.sources,
		})),
	);
	const storedRadiusArcsec = useNedStore((state) => state.nedRadiusArcsec);
	const setStoredRadiusArcsec = useNedStore(
		(state) => state.setNedRadiusArcsec,
	);
	const [panelMode, setPanelMode] = useState<NedPanelMode>("results");
	const [isOpen, setIsOpen] = useState(false);
	const [draft, setDraft] = useState<NedDraftState>(() =>
		createDraftState(storedRadiusArcsec),
	);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const hasCoordinates =
		editorMode === "detail" &&
		activeSource !== null &&
		activeSource.position.ra !== null &&
		activeSource.position.dec !== null;
	const ra = hasCoordinates
		? (activeSource.position.ra ?? undefined)
		: undefined;
	const dec = hasCoordinates
		? (activeSource.position.dec ?? undefined)
		: undefined;
	const query = useNedSearch({
		ra,
		dec,
		radius: storedRadiusArcsec,
		enabled: false,
	});

	const draftArcsec = parseDraftRadiusToArcsec(draft);
	const hasValidDraft = draftArcsec !== null;
	const draftMatchesStored =
		hasValidDraft &&
		Math.abs(draftArcsec - storedRadiusArcsec) < NED_RADIUS_EPSILON;
	const draftValidationReason = !hasValidDraft
		? "NED radius must be a finite number greater than 0 and less than 10 degrees."
		: draftArcsec <= 0
			? "NED radius must be greater than 0 arcsec."
			: draftArcsec >= NED_MAX_RADIUS_ARCSEC
				? "NED radius must be strictly less than 10 degrees."
				: null;
	const saveDisabledReason =
		draftValidationReason ??
		(draftMatchesStored ? "No radius changes to save." : null);
	const refetchDisabledReason = !hasCoordinates
		? "Source position is incomplete."
		: query.isFetching
			? "NED search is already running."
			: draftValidationReason
				? draftValidationReason
				: !draftMatchesStored
					? "Save the radius before refetching."
					: null;
	const triggerTooltip = !hasCoordinates
		? "Source position is incomplete."
		: query.isFetching
			? "NED search is already running."
			: query.isError
				? "Search failed. Left click to retry. Right click for settings."
				: query.isSuccess
					? "Left click for results. Right click for settings."
					: "Left click to search. Right click for settings.";

	return {
		isOpen,
		mode: panelMode,
		onOpenChange: (open) => {
			setIsOpen(open);
			if (!open) {
				return;
			}
		},
		trigger: {
			disabled: !hasCoordinates,
			loading: query.isFetching,
			tooltip: triggerTooltip,
			isHighlighted: query.isSuccess,
			isErrorHighlighted: query.isError,
			onClick: () => {
				if (!hasCoordinates || query.isFetching) {
					return;
				}

				if (query.isSuccess === true) {
					setPanelMode("results");
					setIsOpen(true);
					return;
				}

				void query.refetch();
			},
			onContextMenu: (event) => {
				event.preventDefault();

				if (!hasCoordinates) {
					return;
				}

				setDraft(createDraftState(storedRadiusArcsec, draft.unit));
				setPanelMode("settings");
				setIsOpen(true);
			},
		},
		settings: {
			draftValue: draft.value,
			draftUnit: draft.unit,
			canSave: saveDisabledReason === null,
			saveDisabledReason,
			canRefetch: refetchDisabledReason === null,
			refetchDisabledReason,
			onDraftValueChange: (value) =>
				setDraft((current) => ({
					...current,
					value,
				})),
			onDraftUnitChange: (unit) =>
				setDraft((current) => {
					if (current.unit === unit) {
						return current;
					}

					const currentRadiusArcsec = parseDraftRadiusToArcsec(current);

					return {
						value:
							currentRadiusArcsec === null
								? current.value
								: formatDraftValue(currentRadiusArcsec, unit),
						unit,
					};
				}),
			onSave: () => {
				if (saveDisabledReason !== null || draftArcsec === null) {
					return;
				}

				setStoredRadiusArcsec(draftArcsec);
			},
			onRefetch: () => {
				if (refetchDisabledReason !== null) {
					return;
				}

				void query.refetch();
			},
		},
		results: {
			isFetching: query.isFetching,
			isSuccess: query.isSuccess,
			isError: query.isError,
			errorMessage: getQueryErrorMessage(query.error),
			results: (query.data ?? []).map((result) => ({
				objectName: result.object_name,
				ra: result.ra,
				dec: result.dec,
				redshift: result.redshift,
				url: result.url,
			})),
		},
		hasCoordinates,
	};
}

function createDraftState(
	radiusArcsec: number,
	unit: NedRadiusUnit = "arcsecond",
): NedDraftState {
	return {
		value: formatDraftValue(radiusArcsec, unit),
		unit,
	};
}

function formatDraftValue(radiusArcsec: number, unit: NedRadiusUnit): string {
	return (radiusArcsec / UNIT_OPTIONS[unit]).toString();
}

function parseDraftRadiusToArcsec(draft: NedDraftState): number | null {
	if (draft.value.trim().length === 0) {
		return null;
	}

	const parsedValue = Number(draft.value);
	if (!Number.isFinite(parsedValue)) {
		return null;
	}

	return parsedValue * UNIT_OPTIONS[draft.unit];
}

function getQueryErrorMessage(error: unknown): string | null {
	if (error instanceof Error) {
		return error.message;
	}

	return error == null ? null : "NED search failed.";
}
