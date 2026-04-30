"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LayerModel, RasterStyle } from "@/canvas/imageCanvas";
import type { CounterpartFootprint } from "@/hooks/query/image/schemas";
import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS } from "../shared/constants";
import type { ReferenceLayerFilterRgb } from "../shared/types";
import { useImageInspectorStore } from "../store";
import { getErrorMessage } from "../utils/imageInspectorDataUtils";
import { createCounterpartFrame } from "../utils/imageInspectorFrameAdapters";

const DEFAULT_REFERENCE_STYLE: RasterStyle = {
	norm: {
		vmin: 0,
		vmax: 1,
		stretch: "linear",
	},
	colorMap: "gray",
};

const EMPTY_FILTER_RGB: ReferenceLayerFilterRgb = {
	r: "",
	g: "",
	b: "",
};

interface BitmapState {
	id: string;
	bitmap: ImageBitmap;
}

export interface ReferenceLayerCanvasData {
	referenceLayer: LayerModel | null;
	referenceStyle: RasterStyle;
	errorMessage: string | null;
}

export function useReferenceLayerCanvasData(): ReferenceLayerCanvasData {
	const referenceRequest = useImageInspectorStore(
		(state) => state.referenceCounterpartFetchRequest,
	);
	const filterRgb = referenceRequest?.filterRgb ?? EMPTY_FILTER_RGB;
	const counterpartImageQuery = useQueryAxiosGet<Blob>({
		queryKey: [
			"image-inspector",
			"counterpart-image",
			referenceRequest?.footprintId ?? null,
			filterRgb,
			IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS,
		],
		path: `/image/counterpart_image/${referenceRequest?.footprintId ?? ""}`,
		axiosGetParams: {
			params: {
				...filterRgb,
				...IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS,
			},
			responseType: "blob",
		},
		enabled: false,
		queryOptions: {
			gcTime: 1000 * 60,
		},
	});
	const counterpartFootprintQuery = useQueryAxiosGet<CounterpartFootprint>({
		queryKey: [
			"image-inspector",
			"counterpart-footprint",
			referenceRequest?.footprintId ?? null,
		],
		path: `/image/counterpart_footprint/${referenceRequest?.footprintId ?? ""}`,
		enabled: Boolean(referenceRequest?.footprintId),
	});
	const [bitmapState, setBitmapState] = useState<BitmapState | null>(null);
	const bitmapStateRef = useRef<BitmapState | null>(null);
	const replaceBitmapState = useCallback((nextState: BitmapState | null) => {
		setBitmapState((previous) => {
			if (previous?.bitmap !== nextState?.bitmap) {
				previous?.bitmap.close();
			}
			bitmapStateRef.current = nextState;
			return nextState;
		});
	}, []);

	useEffect(() => {
		const blob = counterpartImageQuery.data;
		if (!blob) {
			replaceBitmapState(null);
			return;
		}

		let cancelled = false;
		const id = `counterpart:${referenceRequest?.id ?? 0}:${counterpartImageQuery.dataUpdatedAt}`;

		void createImageBitmap(blob, {
			premultiplyAlpha: "none",
			colorSpaceConversion: "default",
		})
			.then((bitmap) => {
				if (cancelled) {
					bitmap.close();
					return;
				}

				replaceBitmapState({ id, bitmap });
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return;
				}

				replaceBitmapState(null);
				console.error("Failed to decode counterpart image", error);
			});

		return () => {
			cancelled = true;
		};
	}, [
		counterpartImageQuery.data,
		counterpartImageQuery.dataUpdatedAt,
		referenceRequest?.id,
		replaceBitmapState,
	]);

	useEffect(
		() => () => {
			bitmapStateRef.current?.bitmap.close();
			bitmapStateRef.current = null;
		},
		[],
	);

	const referenceFrame = useMemo(() => {
		if (!bitmapState) {
			return null;
		}

		return createCounterpartFrame({
			id: bitmapState.id,
			bitmap: bitmapState.bitmap,
			footprint: counterpartFootprintQuery.data?.footprint,
		});
	}, [bitmapState, counterpartFootprintQuery.data?.footprint]);
	const errorMessage =
		(counterpartImageQuery.error
			? getErrorMessage(counterpartImageQuery.error)
			: null) ??
		(counterpartFootprintQuery.error
			? getErrorMessage(counterpartFootprintQuery.error)
			: null);

	return {
		referenceLayer: referenceFrame
			? {
					frames: [referenceFrame],
					activeId: referenceFrame.id,
				}
			: null,
		referenceStyle: DEFAULT_REFERENCE_STYLE,
		errorMessage,
	};
}
