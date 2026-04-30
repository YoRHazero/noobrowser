"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Frame, LayerModel, RasterStyle } from "@/canvas/imageCanvas";
import {
	useGrismData,
	useGrismErr,
	useGrismOffsets,
} from "@/hooks/query/image";
import { useGrismFootprints } from "@/hooks/query/overview";
import { useGrismStore } from "@/stores/grism";
import { useImageInspectorStore } from "../store";
import {
	getErrorMessage,
	getIncludedFiles,
} from "../utils/imageInspectorDataUtils";
import { createGrismFrame } from "../utils/imageInspectorFrameAdapters";
import { resolveRasterStyle } from "../utils/imageInspectorRasterStyle";

export interface BaseLayerCanvasData {
	baseLayer: LayerModel | null;
	baseStyle: RasterStyle;
	errorMessage: string | null;
}

export function useBaseLayerCanvasData(): BaseLayerCanvasData {
	const selectedFootprintId = useGrismStore(
		(state) => state.selectedFootprintId,
	);
	const { activeBasenameDraft, baseColorMap, baseNorm } =
		useImageInspectorStore(
			useShallow((state) => ({
				activeBasenameDraft: state.baseLayerActiveBasename,
				baseColorMap: state.baseLayerMainColorMap,
				baseNorm: state.baseLayerMainNorm,
			})),
		);
	const footprintsQuery = useGrismFootprints();
	const activeFootprint = useMemo(
		() =>
			selectedFootprintId
				? (footprintsQuery.data?.find(
						(item) => item.id === selectedFootprintId,
					) ?? null)
				: null,
		[selectedFootprintId, footprintsQuery.data],
	);
	const basenameList = useMemo(
		() => getIncludedFiles(activeFootprint?.meta?.included_files),
		[activeFootprint],
	);
	const activeBasename =
		activeBasenameDraft && basenameList.includes(activeBasenameDraft)
			? activeBasenameDraft
			: (basenameList[0] ?? "");
	const dataQueries = useGrismData({
		basenameList,
		enabled: false,
	});
	const errQueries = useGrismErr({
		basenameList,
		enabled: false,
	});
	const offsetQueries = useGrismOffsets({
		groupId: selectedFootprintId,
		basenameList,
		enabled: false,
	});
	const baseFrames = useMemo(
		() =>
			basenameList
				.map((basename) =>
					createGrismFrame({
						basename,
						data: dataQueries[basename]?.data,
						err: errQueries[basename]?.data,
						offset: offsetQueries[basename]?.data,
						dataUpdatedAt: dataQueries[basename]?.dataUpdatedAt ?? 0,
						errUpdatedAt: errQueries[basename]?.dataUpdatedAt ?? 0,
						offsetUpdatedAt: offsetQueries[basename]?.dataUpdatedAt ?? 0,
					}),
				)
				.filter((frame): frame is Frame => frame !== null),
		[basenameList, dataQueries, errQueries, offsetQueries],
	);
	const activeFrame =
		baseFrames.find((frame) =>
			frame.id.startsWith(`grism:${activeBasename}:`),
		) ??
		baseFrames[0] ??
		null;
	const baseStyle = useMemo(
		() =>
			resolveRasterStyle({
				colorMap: baseColorMap,
				norm: baseNorm,
				frame: activeFrame,
			}),
		[baseColorMap, activeFrame, baseNorm],
	);
	const queryError = [
		...Object.values(dataQueries),
		...Object.values(errQueries),
		...Object.values(offsetQueries),
	].find((query) => query.error)?.error;
	const errorMessage =
		(footprintsQuery.error ? getErrorMessage(footprintsQuery.error) : null) ??
		(queryError ? getErrorMessage(queryError) : null);

	return {
		baseLayer: activeFrame
			? {
					frames: baseFrames,
					activeId: activeFrame.id,
				}
			: null,
		baseStyle,
		errorMessage,
	};
}
