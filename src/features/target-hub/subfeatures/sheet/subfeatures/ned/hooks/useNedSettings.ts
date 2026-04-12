"use client";

import { useState } from "react";
import { NED_RADIUS_EPSILON } from "../shared/constants";
import type { NedRadiusUnit } from "../shared/types";
import { useNedStore } from "../store";
import { createNedDraftState } from "../utils/createNedDraftState";
import { formatNedRadiusValue } from "../utils/formatNedRadiusValue";
import { getNedDraftValidationReason } from "../utils/getNedDraftValidationReason";
import { parseNedDraftRadiusToArcsec } from "../utils/parseNedDraftRadiusToArcsec";

interface UseNedSettingsArgs {
	hasCoordinates: boolean;
	isFetching: boolean;
	refetch: () => void;
}

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
	resetDraftToStoredRadius: () => void;
}

export function useNedSettings({
	hasCoordinates,
	isFetching,
	refetch,
}: UseNedSettingsArgs): NedSettingsModel {
	const storedRadiusArcsec = useNedStore((state) => state.nedRadiusArcsec);
	const setStoredRadiusArcsec = useNedStore(
		(state) => state.setNedRadiusArcsec,
	);
	const [draft, setDraft] = useState<NedDraftState>(() =>
		createNedDraftState(storedRadiusArcsec),
	);

	const draftArcsec = parseNedDraftRadiusToArcsec(draft.value, draft.unit);
	const draftMatchesStored =
		draftArcsec !== null &&
		Math.abs(draftArcsec - storedRadiusArcsec) < NED_RADIUS_EPSILON;
	const draftValidationReason = getNedDraftValidationReason(draftArcsec);
	const saveDisabledReason =
		draftValidationReason ??
		(draftMatchesStored ? "No radius changes to save." : null);
	const refetchDisabledReason = !hasCoordinates
		? "Source position is incomplete."
		: isFetching
			? "NED search is already running."
			: draftValidationReason
				? draftValidationReason
				: !draftMatchesStored
					? "Save the radius before refetching."
					: null;

	return {
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

				const currentRadiusArcsec = parseNedDraftRadiusToArcsec(
					current.value,
					current.unit,
				);

				return {
					value:
						currentRadiusArcsec === null
							? current.value
							: formatNedRadiusValue(currentRadiusArcsec, unit),
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

			refetch();
		},
		resetDraftToStoredRadius: () => {
			setDraft((current) =>
				createNedDraftState(storedRadiusArcsec, current.unit),
			);
		},
	};
}
