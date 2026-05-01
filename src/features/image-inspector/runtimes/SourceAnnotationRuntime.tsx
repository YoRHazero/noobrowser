"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Point, Rect, SourceAnnotation } from "@/canvas/imageCanvas";
import { isPointInRect, normalizeRect } from "@/canvas/imageCanvas/utils/rect";
import { useGrismData, useGrismOffsets } from "@/hooks/query/image";
import type {
	CounterpartFootprint,
	GrismData,
	GrismOffset,
} from "@/hooks/query/image/schemas";
import { useGrismFootprints } from "@/hooks/query/overview";
import type { DispersionTrace } from "@/hooks/query/source/schemas";
import { useDispersionTrace } from "@/hooks/query/source/useDispersionTrace";
import { useSourcePosition } from "@/hooks/query/source/useSourcePosition";
import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { useGrismStore } from "@/stores/grism";
import type { Source } from "@/stores/source";
import { useSourceStore } from "@/stores/source";
import { useImageInspectorStore } from "../store";
import {
	getIncludedFiles,
	isValidImageSize,
} from "../utils/imageInspectorDataUtils";

type RuntimeSource = Pick<Source, "id" | "color" | "position" | "imageRef">;

interface SourcePositionInput {
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
	enabled: boolean;
}

function isFiniteNumber(value: number | null | undefined): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function resolveSourcePositionInput(
	source: RuntimeSource,
): SourcePositionInput {
	const ref_basename = source.imageRef.refBasename ?? undefined;
	if (
		isFiniteNumber(source.position.ra) &&
		isFiniteNumber(source.position.dec)
	) {
		return {
			ra: source.position.ra,
			dec: source.position.dec,
			ref_basename,
			enabled: true,
		};
	}

	if (isFiniteNumber(source.position.x) && isFiniteNumber(source.position.y)) {
		return {
			x: source.position.x,
			y: source.position.y,
			ref_basename,
			enabled: true,
		};
	}

	return {
		ref_basename,
		enabled: false,
	};
}

function createReferenceFrameRects(
	footprint: CounterpartFootprint["footprint"] | undefined,
): Rect[] {
	const marker = footprint?.vertex_marker;
	if (!marker || marker.length < 3) {
		return [];
	}

	const origin = marker[0];
	const opposite = marker[2];
	if (!origin || !opposite) {
		return [];
	}

	const rect = normalizeRect({
		x: origin[0],
		y: origin[1],
		width: opposite[0] - origin[0],
		height: opposite[1] - origin[1],
	});

	return rect ? [rect] : [];
}

function createBaseFrameRects({
	basenameList,
	dataQueries,
	offsetQueries,
}: {
	basenameList: readonly string[];
	dataQueries: Record<string, UseQueryResult<GrismData>>;
	offsetQueries: Record<string, UseQueryResult<GrismOffset>>;
}): Rect[] {
	const rects: Rect[] = [];

	for (const basename of basenameList) {
		const data = dataQueries[basename]?.data;
		const offset = offsetQueries[basename]?.data;
		if (!data || !offset || !isValidImageSize(data.width, data.height)) {
			continue;
		}

		rects.push({
			x: offset.dx,
			y: offset.dy,
			width: data.width,
			height: data.height,
		});
	}

	return rects;
}

function createTracePoints(
	trace: DispersionTrace | undefined,
): Point[] | undefined {
	if (!trace || trace.trace_xs.length !== trace.trace_ys.length) {
		return undefined;
	}

	const points: Point[] = [];
	for (let index = 0; index < trace.trace_xs.length; index += 1) {
		const x = trace.trace_xs[index];
		const y = trace.trace_ys[index];
		if (!Number.isFinite(x) || !Number.isFinite(y)) {
			continue;
		}

		points.push({ x, y });
	}

	return points.length >= 2 ? points : undefined;
}

export default function SourceAnnotationRuntime() {
	const selectedFootprintId = useGrismStore(
		(state) => state.selectedFootprintId,
	);
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);
	const {
		referenceRequest,
		referenceFetchStatus,
		clearAnnotationLayerSources,
	} = useImageInspectorStore(
		useShallow((state) => ({
			referenceRequest: state.referenceCounterpartFetchRequest,
			referenceFetchStatus: state.referenceCounterpartFetchStatus,
			clearAnnotationLayerSources: state.clearAnnotationLayerSources,
		})),
	);
	const hasCurrentReferenceImage =
		selectedFootprintId !== null &&
		referenceFetchStatus === "success" &&
		referenceRequest?.footprintId === selectedFootprintId;
	const footprintsQuery = useGrismFootprints();
	const activeFootprint = useMemo(
		() =>
			selectedFootprintId
				? (footprintsQuery.data?.find(
						(item) => item.id === selectedFootprintId,
					) ?? null)
				: null,
		[footprintsQuery.data, selectedFootprintId],
	);
	const basenameList = useMemo(
		() => getIncludedFiles(activeFootprint?.meta?.included_files),
		[activeFootprint],
	);
	const dataQueries = useGrismData({
		basenameList,
		enabled: false,
	});
	const offsetQueries = useGrismOffsets({
		groupId: selectedFootprintId,
		basenameList,
		enabled: false,
	});
	const footprintQuery = useQueryAxiosGet<CounterpartFootprint>({
		queryKey: ["image-inspector", "counterpart-footprint", selectedFootprintId],
		path: `/image/counterpart_footprint/${selectedFootprintId ?? ""}`,
		enabled: hasCurrentReferenceImage,
	});
	const referenceFrameRects = useMemo(
		() =>
			hasCurrentReferenceImage
				? createReferenceFrameRects(footprintQuery.data?.footprint)
				: [],
		[footprintQuery.data?.footprint, hasCurrentReferenceImage],
	);
	const baseFrameRects = useMemo(
		() =>
			createBaseFrameRects({
				basenameList,
				dataQueries,
				offsetQueries,
			}),
		[basenameList, dataQueries, offsetQueries],
	);
	const frameRects = useMemo(
		() => [...baseFrameRects, ...referenceFrameRects],
		[baseFrameRects, referenceFrameRects],
	);
	const visibleSources = useMemo(
		() => sources.filter((source) => source.visibility.inspector),
		[sources],
	);
	const enabled = selectedFootprintId !== null && frameRects.length > 0;
	const annotationScopeKey = `${selectedFootprintId}:${referenceRequest?.id ?? "none"}`;

	useEffect(() => {
		if (!enabled) {
			clearAnnotationLayerSources();
		}
	}, [clearAnnotationLayerSources, enabled]);

	if (!enabled) {
		return null;
	}

	return (
		<>
			{visibleSources.map((source) => (
				<SourceAnnotationRuntimeTask
					key={`${annotationScopeKey}:${source.id}`}
					active={source.id === activeSourceId}
					frameRects={frameRects}
					selectedFootprintId={selectedFootprintId}
					source={source}
				/>
			))}
		</>
	);
}

function SourceAnnotationRuntimeTask({
	active,
	frameRects,
	selectedFootprintId,
	source,
}: {
	active: boolean;
	frameRects: readonly Rect[];
	selectedFootprintId: string;
	source: RuntimeSource;
}) {
	const upsertAnnotationLayerSource = useImageInspectorStore(
		(state) => state.upsertAnnotationLayerSource,
	);
	const removeAnnotationLayerSource = useImageInspectorStore(
		(state) => state.removeAnnotationLayerSource,
	);
	const positionInput = resolveSourcePositionInput(source);
	const positionQuery = useSourcePosition({
		selectedFootprintId,
		x: positionInput.x,
		y: positionInput.y,
		ra: positionInput.ra,
		dec: positionInput.dec,
		ref_basename: positionInput.ref_basename,
		enabled: positionInput.enabled,
	});
	const resolvedX = positionQuery.data?.x;
	const resolvedY = positionQuery.data?.y;
	const resolvedPoint =
		isFiniteNumber(resolvedX) && isFiniteNumber(resolvedY)
			? { x: resolvedX, y: resolvedY }
			: null;
	const insideLayerFrame =
		resolvedPoint !== null &&
		frameRects.some((rect) => isPointInRect(resolvedPoint, rect));
	const traceQuery = useDispersionTrace({
		selectedFootprintId,
		basename: positionQuery.data?.ref_basename ?? positionInput.ref_basename,
		x: insideLayerFrame ? resolvedPoint?.x : undefined,
		y: insideLayerFrame ? resolvedPoint?.y : undefined,
		enabled: insideLayerFrame,
	});
	const tracePoints = useMemo(
		() => createTracePoints(traceQuery.data),
		[traceQuery.data],
	);
	const annotation = useMemo<SourceAnnotation | null>(() => {
		if (!isFiniteNumber(resolvedX) || !isFiniteNumber(resolvedY)) {
			return null;
		}

		if (!insideLayerFrame) {
			return null;
		}

		return {
			id: source.id,
			x: resolvedX,
			y: resolvedY,
			color: source.color,
			active,
			visible: true,
			trace: tracePoints ? { points: tracePoints } : undefined,
		};
	}, [
		active,
		insideLayerFrame,
		resolvedX,
		resolvedY,
		source.color,
		source.id,
		tracePoints,
	]);

	useEffect(() => {
		if (!annotation) {
			removeAnnotationLayerSource(source.id);
			return;
		}

		upsertAnnotationLayerSource(annotation);
	}, [
		annotation,
		removeAnnotationLayerSource,
		source.id,
		upsertAnnotationLayerSource,
	]);

	useEffect(
		() => () => {
			removeAnnotationLayerSource(source.id);
		},
		[removeAnnotationLayerSource, source.id],
	);

	return null;
}
