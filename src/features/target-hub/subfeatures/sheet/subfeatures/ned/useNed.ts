"use client";

import type { MouseEvent } from "react";
import { useNedSearchModel } from "./hooks/useNedSearchModel";
import { useNedSettings } from "./hooks/useNedSettings";
import { useNedTarget } from "./hooks/useNedTarget";
import type { NedPanelMode, NedRadiusUnit } from "./shared/types";

export interface NedTriggerModel {
	disabled: boolean;
	loading: boolean;
	tooltip: string;
	isHighlighted: boolean;
	isErrorHighlighted: boolean;
	onClick: () => void;
	onContextMenu: (event: MouseEvent<HTMLButtonElement>) => void;
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

export interface NedModel {
	isOpen: boolean;
	mode: NedPanelMode;
	onOpenChange: (open: boolean) => void;
	trigger: NedTriggerModel;
	settings: NedSettingsModel;
	results: NedResultsModel;
	hasCoordinates: boolean;
}

export function useNed(): NedModel {
	const target = useNedTarget();
	const search = useNedSearchModel({
		hasCoordinates: target.hasCoordinates,
		ra: target.ra,
		dec: target.dec,
	});
	const settings = useNedSettings({
		hasCoordinates: target.hasCoordinates,
		isFetching: search.isFetching,
		refetch: search.refetch,
	});

	return {
		isOpen: search.isOpen,
		mode: search.mode,
		onOpenChange: search.onOpenChange,
		trigger: {
			...search.trigger,
			onContextMenu: (event: MouseEvent<HTMLButtonElement>) => {
				settings.resetDraftToStoredRadius();
				search.trigger.onContextMenu(event);
			},
		},
		settings,
		results: search.results,
		hasCoordinates: target.hasCoordinates,
	};
}
