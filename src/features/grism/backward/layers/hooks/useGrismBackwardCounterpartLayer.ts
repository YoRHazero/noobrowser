import { toaster } from "@/components/ui/toaster";
import { useIdSyncCounterpartPosition } from "@/features/grism/hooks/useIdSyncCounterpartPosition";
import { useCounterpartImage } from "@/hooks/query/image/useCounterpartImage";
import { useSourcePosition } from "@/hooks/query/source/useSourcePosition";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
	ClampToEdgeWrapping,
	LinearFilter,
	SRGBColorSpace,
	Texture,
} from "three";
import { useShallow } from "zustand/react/shallow";

export function useGrismBackwardCounterpartLayer(visible?: boolean) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { counterpartPosition, displayMode, opacity } = useCounterpartStore(
		useShallow((state) => ({
			counterpartPosition: state.counterpartPosition,
			displayMode: state.displayMode,
			opacity: state.opacity,
		})),
	);

	const { counterpartVisible, roiState, roiCollapseWindow } = useGrismStore(
		useShallow((state) => ({
			counterpartVisible: state.counterpartVisible,
			roiState: state.roiState,
			roiCollapseWindow: state.roiCollapseWindow,
		})),
	);

	const {
		traceMode,
		mainTraceSourceId,
		addTraceSource,
		updateMainTraceSource,
		removeTraceSource,
	} = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			mainTraceSourceId: state.mainTraceSourceId,
			addTraceSource: state.addTraceSource,
			updateMainTraceSource: state.updateMainTraceSource,
			removeTraceSource: state.removeTraceSource,
		})),
	);

	const { selectedFootprintId } = useIdSyncCounterpartPosition();

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [texture, setTexture] = useState<Texture | null>(null);
	const [clickedPosition, setClickedPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isVisible = visible ?? counterpartVisible;

	const modeInt = useMemo(() => {
		switch (displayMode) {
			case "r":
				return 1;
			case "g":
				return 2;
			case "b":
				return 3;
			default:
				return 0;
		}
	}, [displayMode]);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const counterpartImageQuery = useCounterpartImage({});

	const sourcePositionQuery = useSourcePosition({
		x: clickedPosition?.x,
		y: clickedPosition?.y,
		selectedFootprintId: selectedFootprintId ?? undefined,
		enabled: !!clickedPosition,
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		if (!counterpartImageQuery.isSuccess || !counterpartImageQuery.data) return;

		const blob = counterpartImageQuery.data;
		let isCancelled = false;

		const loadTexture = async () => {
			try {
				const bitmap = await createImageBitmap(blob, {
					imageOrientation: "flipY", // png y axis is flipped
					premultiplyAlpha: "none",
					colorSpaceConversion: "default",
				});

				if (isCancelled) {
					bitmap.close();
					return;
				}

				const newTexture = new Texture(bitmap);

				newTexture.colorSpace = SRGBColorSpace;
				newTexture.minFilter = LinearFilter;
				newTexture.magFilter = LinearFilter;
				newTexture.wrapS = ClampToEdgeWrapping;
				newTexture.wrapT = ClampToEdgeWrapping;
				newTexture.needsUpdate = true;

				setTexture(newTexture);
			} catch (e) {
				queueMicrotask(() => {
					toaster.error({
						title: "Failed to load counterpart image",
						description: (e as Error).message,
					});
				});
			}
		};

		loadTexture();

		return () => {
			isCancelled = true;
			setTexture((prev) => {
				if (prev) prev.dispose();
				return null;
			});
		};
	}, [counterpartImageQuery.data, counterpartImageQuery.isSuccess]);

	useEffect(() => {
		if (
			sourcePositionQuery.isSuccess &&
			sourcePositionQuery.data &&
			clickedPosition
		) {
			const { x, y, ra, dec, ref_basename } = sourcePositionQuery.data;

			// Verify distance consistency
			if (typeof x === "number" && typeof y === "number") {
				const dist = Math.hypot(x - clickedPosition.x, y - clickedPosition.y);
				if (dist > 1) {
					throw new Error(
						`Position mismatch: clicked (${clickedPosition.x.toFixed(2)}, ${clickedPosition.y.toFixed(2)}) vs returned (${x.toFixed(2)}, ${y.toFixed(2)})`,
					);
				}
			}

			if (
				typeof ra === "number" &&
				typeof dec === "number" &&
				ref_basename &&
				typeof x === "number" &&
				typeof y === "number"
			) {
				const id = `${ref_basename}_${ra.toFixed(6)}_${dec.toFixed(6)}`;
				addTraceSource(
					id,
					x,
					y,
					ra,
					dec,
					selectedFootprintId,
					{
						roiState,
						collapseWindow: roiCollapseWindow,
					},
				);
			}
			// Reset after consuming
			setClickedPosition(null);
		}
	}, [
		sourcePositionQuery.isSuccess,
		sourcePositionQuery.data,
		clickedPosition,
		addTraceSource,
		selectedFootprintId,
		roiState,
		roiCollapseWindow,
	]);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
		if (!traceMode) return;
		event.nativeEvent.preventDefault();
		event.stopPropagation();

		const { x, y } = event.point;
		const isShiftPressed = event.nativeEvent.shiftKey;
		const isModPressed = event.nativeEvent.metaKey || event.nativeEvent.ctrlKey;
		if (isShiftPressed) {
			setClickedPosition({ x, y: -y });
		} else if (isModPressed) {
			if (mainTraceSourceId) {
				removeTraceSource(mainTraceSourceId);
			}
		} else {

			updateMainTraceSource({ x, y: -y, ra: undefined, dec: undefined });
		}
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		isVisible,
		texture,
		modeInt,
		opacity,
		counterpartPosition,
		handleContextMenu,
	};
}
