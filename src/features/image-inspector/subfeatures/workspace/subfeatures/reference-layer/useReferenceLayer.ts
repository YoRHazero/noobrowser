"use client";

import { useShallow } from "zustand/react/shallow";
import { useClearImageFilters } from "@/hooks/query/overview";
import { useOverviewStore } from "@/stores/overview";
import type {
	ReferenceLayerMode,
	ReferenceLayerRgbChannel,
} from "../../../../shared/types";
import { useImageInspectorStore } from "../../../../store";

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unknown error";
}

export interface ReferenceLayerViewModel {
	filterOptions: string[];
	filterRgb: Record<ReferenceLayerRgbChannel, string>;
	mode: ReferenceLayerMode;
	opacity: number;
	isLoadingFilters: boolean;
	isFetchingImage: boolean;
	filterErrorMessage: string | null;
	downloadDisabledReason: string | null;
	onFilterChange: (channel: ReferenceLayerRgbChannel, value: string) => void;
	onModeCardClick: (channel: ReferenceLayerRgbChannel) => void;
	onOpacityChange: (opacity: number) => void;
	onDownloadCounterpartImage: () => void;
}

export function useReferenceLayer(): ReferenceLayerViewModel {
	const footprintId = useOverviewStore((state) => state.selectedFootprintId);
	const {
		filterRgb,
		mode,
		opacity,
		setFilter,
		setMode,
		setOpacity,
		fetchStatus,
		fetchErrorMessage,
		requestCounterpartFetch,
	} = useImageInspectorStore(
		useShallow((state) => ({
			filterRgb: state.referenceFilterRgb,
			mode: state.referenceMode,
			opacity: state.referenceOpacity,
			setFilter: state.setReferenceFilter,
			setMode: state.setReferenceMode,
			setOpacity: state.setReferenceOpacity,
			fetchStatus: state.referenceCounterpartFetchStatus,
			fetchErrorMessage: state.referenceCounterpartFetchErrorMessage,
			requestCounterpartFetch: state.requestReferenceCounterpartFetch,
		})),
	);
	const filtersQuery = useClearImageFilters();
	const downloadDisabledReason =
		fetchStatus === "pending"
			? "Fetching counterpart image."
			: footprintId === null
				? "Select a footprint in Overview."
				: !filterRgb.r || !filterRgb.g || !filterRgb.b
					? "Choose R, G, and B filters first."
					: null;

	return {
		filterOptions: filtersQuery.data?.filters ?? [],
		filterRgb,
		mode,
		opacity,
		isLoadingFilters: filtersQuery.isLoading,
		isFetchingImage: fetchStatus === "pending",
		filterErrorMessage:
			(filtersQuery.error ? getErrorMessage(filtersQuery.error) : null) ??
			fetchErrorMessage,
		downloadDisabledReason,
		onFilterChange: setFilter,
		onModeCardClick: (channel) => {
			if (mode === channel) {
				setMode("rgb");
				return;
			}

			setMode(channel);
		},
		onOpacityChange: setOpacity,
		onDownloadCounterpartImage: () => {
			if (downloadDisabledReason || !footprintId) {
				return;
			}

			requestCounterpartFetch({
				footprintId,
				filterRgb,
			});
		},
	};
}
