import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import type { ImagePointerEvent } from "../api";
import { buildImagePointerEvent } from "../utils";

type CanvasMouseEvent = MouseEvent | PointerEvent;

export function useImagePointerHandlers({
	onImagePointer,
	target,
	stopPropagation = true,
}: {
	onImagePointer: ((event: ImagePointerEvent) => void) | undefined;
	target: ImagePointerEvent["target"];
	stopPropagation?: boolean;
}) {
	return useMemo(() => {
		const emit = (
			event: ThreeEvent<CanvasMouseEvent>,
			phase: ImagePointerEvent["phase"],
		) => {
			if (phase === "contextmenu") {
				event.nativeEvent.preventDefault();
			}
			if (stopPropagation) {
				event.stopPropagation();
			}

			onImagePointer?.(
				buildImagePointerEvent({
					phase,
					point: {
						x: event.point.x,
						y: event.point.y,
					},
					target,
					button: event.nativeEvent.button,
					shiftKey: event.nativeEvent.shiftKey,
					metaKey: event.nativeEvent.metaKey,
					ctrlKey: event.nativeEvent.ctrlKey,
					altKey: event.nativeEvent.altKey,
				}),
			);
		};

		return {
			onPointerDown: (event: ThreeEvent<PointerEvent>) => {
				emit(event, "down");
			},
			onPointerMove: (event: ThreeEvent<PointerEvent>) => {
				emit(event, "move");
			},
			onPointerUp: (event: ThreeEvent<PointerEvent>) => {
				emit(event, "up");
			},
			onClick: (event: ThreeEvent<MouseEvent>) => {
				emit(event, "click");
			},
			onContextMenu: (event: ThreeEvent<MouseEvent>) => {
				emit(event, "contextmenu");
			},
		};
	}, [onImagePointer, stopPropagation, target]);
}
