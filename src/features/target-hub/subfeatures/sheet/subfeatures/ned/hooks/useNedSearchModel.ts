"use client";

import { type MouseEvent, useState } from "react";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";
import type { NedPanelMode } from "../shared/types";
import { useNedStore } from "../store";
import { getNedQueryErrorMessage, mapNedSearchResults } from "../utils";

interface UseNedSearchModelArgs {
	hasCoordinates: boolean;
	ra: number | undefined;
	dec: number | undefined;
}

interface NedSearchResult {
	objectName: string;
	ra: number;
	dec: number;
	redshift: number | null;
	url: string;
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

export interface NedResultsModel {
	isFetching: boolean;
	isSuccess: boolean;
	isError: boolean;
	errorMessage: string | null;
	results: NedSearchResult[];
}

export interface NedSearchModel {
	isOpen: boolean;
	mode: NedPanelMode;
	onOpenChange: (open: boolean) => void;
	trigger: NedTriggerModel;
	results: NedResultsModel;
	refetch: () => void;
	isFetching: boolean;
}

export function useNedSearchModel({
	hasCoordinates,
	ra,
	dec,
}: UseNedSearchModelArgs): NedSearchModel {
	const [mode, setMode] = useState<NedPanelMode>("results");
	const [isOpen, setIsOpen] = useState(false);
	const radiusArcsec = useNedStore((state) => state.nedRadiusArcsec);
	const query = useNedSearch({
		ra,
		dec,
		radius: radiusArcsec,
		enabled: false,
	});

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
		mode,
		onOpenChange: (open) => {
			setIsOpen(open);
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
					setMode("results");
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

				setMode("settings");
				setIsOpen(true);
			},
		},
		results: {
			isFetching: query.isFetching,
			isSuccess: query.isSuccess,
			isError: query.isError,
			errorMessage: getNedQueryErrorMessage(query.error),
			results: mapNedSearchResults(query.data ?? []),
		},
		refetch: () => {
			void query.refetch();
		},
		isFetching: query.isFetching,
	};
}
