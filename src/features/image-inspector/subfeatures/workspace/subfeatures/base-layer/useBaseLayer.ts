"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismFootprints } from "@/hooks/query/overview";
import { useOverviewStore } from "@/stores/overview";
import type {
	BaseLayerColorMap,
	BaseLayerNormRangeMode,
	BaseLayerStretch,
} from "../../../../shared/types";
import {
	type BaseLayerNormState,
	useImageInspectorStore,
} from "../../../../store";

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unknown error";
}

function getIncludedFiles(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(
		(item): item is string =>
			typeof item === "string" && item.trim().length > 0,
	);
}

export interface BaseLayerViewModel {
	footprintId: string;
	basenameOptions: string[];
	activeBasename: string;
	isFetchingImages: boolean;
	errorMessage: string | null;
	downloadDisabledReason: string | null;
	mainCanvas: {
		colorMap: BaseLayerColorMap;
		norm: BaseLayerNormState;
		onColorMapChange: (colorMap: BaseLayerColorMap) => void;
		onRangeModeChange: (rangeMode: BaseLayerNormRangeMode) => void;
		onMinChange: (min: number) => void;
		onMaxChange: (max: number) => void;
		onStretchChange: (stretch: BaseLayerStretch) => void;
	};
	roiCanvas: {
		independentNorm: boolean;
		norm: BaseLayerNormState;
		onIndependentNormChange: (independent: boolean) => void;
		onRangeModeChange: (rangeMode: BaseLayerNormRangeMode) => void;
		onMinChange: (min: number) => void;
		onMaxChange: (max: number) => void;
		onStretchChange: (stretch: BaseLayerStretch) => void;
	};
	onBasenameChange: (basename: string) => void;
	onDownloadGrismImages: () => void;
}

export function useBaseLayer(): BaseLayerViewModel {
	const footprintId = useOverviewStore((state) => state.selectedFootprintId);
	const {
		activeBasenameDraft,
		mainColorMap,
		mainNorm,
		roiIndependentNorm,
		roiNorm,
		setActiveBasename,
		setMainColorMap,
		setMainRangeMode,
		setMainMin,
		setMainMax,
		setMainStretch,
		setRoiIndependentNorm,
		setRoiRangeMode,
		setRoiMin,
		setRoiMax,
		setRoiStretch,
		fetchStatus,
		fetchErrorMessage,
		requestGrismFetch,
	} = useImageInspectorStore(
		useShallow((state) => ({
			activeBasenameDraft: state.baseLayerActiveBasename,
			mainColorMap: state.baseLayerMainColorMap,
			mainNorm: state.baseLayerMainNorm,
			roiIndependentNorm: state.baseLayerRoiIndependentNorm,
			roiNorm: state.baseLayerRoiNorm,
			setActiveBasename: state.setBaseLayerActiveBasename,
			setMainColorMap: state.setBaseLayerMainColorMap,
			setMainRangeMode: state.setBaseLayerMainRangeMode,
			setMainMin: state.setBaseLayerMainMin,
			setMainMax: state.setBaseLayerMainMax,
			setMainStretch: state.setBaseLayerMainStretch,
			setRoiIndependentNorm: state.setBaseLayerRoiIndependentNorm,
			setRoiRangeMode: state.setBaseLayerRoiRangeMode,
			setRoiMin: state.setBaseLayerRoiMin,
			setRoiMax: state.setBaseLayerRoiMax,
			setRoiStretch: state.setBaseLayerRoiStretch,
			fetchStatus: state.baseLayerGrismFetchStatus,
			fetchErrorMessage: state.baseLayerGrismFetchErrorMessage,
			requestGrismFetch: state.requestBaseLayerGrismFetch,
		})),
	);
	const footprintsQuery = useGrismFootprints();
	const activeFootprint = useMemo(
		() =>
			footprintId
				? (footprintsQuery.data?.find((item) => item.id === footprintId) ??
					null)
				: null,
		[footprintId, footprintsQuery.data],
	);
	const basenameList = useMemo(
		() => getIncludedFiles(activeFootprint?.meta?.included_files),
		[activeFootprint],
	);
	const activeBasename =
		activeBasenameDraft && basenameList.includes(activeBasenameDraft)
			? activeBasenameDraft
			: (basenameList[0] ?? "");
	const downloadDisabledReason =
		fetchStatus === "pending"
			? "Fetching grism images."
			: footprintId === null
				? "Select a footprint in Overview."
				: basenameList.length === 0
					? "No grism basenames found."
					: null;

	return {
		footprintId: footprintId ?? "—",
		basenameOptions: basenameList,
		activeBasename,
		isFetchingImages: fetchStatus === "pending",
		errorMessage:
			(footprintsQuery.isError && footprintsQuery.error
				? getErrorMessage(footprintsQuery.error)
				: null) ?? fetchErrorMessage,
		downloadDisabledReason,
		mainCanvas: {
			colorMap: mainColorMap,
			norm: mainNorm,
			onColorMapChange: setMainColorMap,
			onRangeModeChange: setMainRangeMode,
			onMinChange: setMainMin,
			onMaxChange: setMainMax,
			onStretchChange: setMainStretch,
		},
		roiCanvas: {
			independentNorm: roiIndependentNorm,
			norm: roiNorm,
			onIndependentNormChange: setRoiIndependentNorm,
			onRangeModeChange: setRoiRangeMode,
			onMinChange: setRoiMin,
			onMaxChange: setRoiMax,
			onStretchChange: setRoiStretch,
		},
		onBasenameChange: (basename) => setActiveBasename(basename || null),
		onDownloadGrismImages: () => {
			if (downloadDisabledReason || !footprintId || basenameList.length === 0) {
				return;
			}

			requestGrismFetch({
				footprintId,
				basenameList,
			});
		},
	};
}
