import { toaster } from "@/components/ui/toaster";
import { useIdSyncCounterpartPosition } from "@/hook/calculation-hook";
import { useCounterpartImage } from "@/hooks/query/image/useCounterpartImage";
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
	const isVisible = visible ?? counterpartVisible;

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
	/*                         Load image with ImageBitmap                        */
	/* -------------------------------------------------------------------------- */
	const counterpartImageQuery = useCounterpartImage({});

	const [texture, setTexture] = useState<Texture | null>(null);

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

	const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
		if (!traceMode) return;
		event.nativeEvent.preventDefault();
		event.stopPropagation();

		const { x, y } = event.point;
		const isShiftPressed = event.nativeEvent.shiftKey;
		const isModPressed = event.nativeEvent.metaKey || event.nativeEvent.ctrlKey;
		if (isShiftPressed) {
			addTraceSource(x, -y, selectedFootprintId, {
				roiState,
				collapseWindow: roiCollapseWindow,
			});
		} else if (isModPressed) {
			if (mainTraceSourceId) {
				removeTraceSource(mainTraceSourceId);
			}
		} else {
			updateMainTraceSource({ x, y: -y });
		}
	};

	return {
		isVisible,
		texture,
		modeInt,
		opacity,
		counterpartPosition,
		handleContextMenu,
	};
}
