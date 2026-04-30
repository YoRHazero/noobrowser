import type { ThreeEvent } from "@react-three/fiber";
import { useState } from "react";
import type { Rect } from "../api";
import {
	IMAGE_CANVAS_COLLAPSE_HIT_THICKNESS,
	IMAGE_CANVAS_COLLAPSE_OUTLINE_COLOR,
} from "../shared/constants";
import { resizeRoiLocalRect, roiLocalRectToWorldRect } from "../utils";
import { RectOutline } from "./RectOutline";

type DragMode = "move" | "left" | "right" | "bottom" | "top";

interface DragState {
	mode: DragMode;
	startPoint: { x: number; y: number };
	startWindow: Rect;
}

function capturePointer(event: ThreeEvent<PointerEvent>) {
	const target = event.target as Element | undefined;
	target?.setPointerCapture?.(event.pointerId);
}

function releasePointer(event: ThreeEvent<PointerEvent>) {
	const target = event.target as Element | undefined;
	target?.releasePointerCapture?.(event.pointerId);
}

function HitArea({
	rect,
	mode,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}: {
	rect: Rect;
	mode: DragMode;
	onPointerDown: (mode: DragMode, event: ThreeEvent<PointerEvent>) => void;
	onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
	onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
}) {
	return (
		<mesh
			position={[rect.x + rect.width / 2, rect.y + rect.height / 2, 9.2]}
			onPointerDown={(event) => onPointerDown(mode, event)}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		>
			<planeGeometry args={[rect.width, rect.height]} />
			<meshBasicMaterial transparent opacity={0} depthWrite={false} />
		</mesh>
	);
}

export function CollapseWindowGizmo({
	roi,
	collapseWindow,
	onChange,
}: {
	roi: Rect;
	collapseWindow: Rect;
	onChange: (window: Rect) => void;
}) {
	const [dragState, setDragState] = useState<DragState | null>(null);
	const worldRect = roiLocalRectToWorldRect(roi, collapseWindow);
	const hitThickness = IMAGE_CANVAS_COLLAPSE_HIT_THICKNESS;
	const hitAreas = {
		move: {
			x: worldRect.x + hitThickness / 2,
			y: worldRect.y + hitThickness / 2,
			width: Math.max(0, worldRect.width - hitThickness),
			height: Math.max(0, worldRect.height - hitThickness),
		},
		left: {
			x: worldRect.x - hitThickness / 2,
			y: worldRect.y,
			width: hitThickness,
			height: worldRect.height,
		},
		right: {
			x: worldRect.x + worldRect.width - hitThickness / 2,
			y: worldRect.y,
			width: hitThickness,
			height: worldRect.height,
		},
		bottom: {
			x: worldRect.x,
			y: worldRect.y - hitThickness / 2,
			width: worldRect.width,
			height: hitThickness,
		},
		top: {
			x: worldRect.x,
			y: worldRect.y + worldRect.height - hitThickness / 2,
			width: worldRect.width,
			height: hitThickness,
		},
	};

	const handlePointerDown = (
		mode: DragMode,
		event: ThreeEvent<PointerEvent>,
	) => {
		if (event.nativeEvent.button !== 0) {
			return;
		}

		event.stopPropagation();
		capturePointer(event);
		setDragState({
			mode,
			startPoint: {
				x: event.point.x,
				y: event.point.y,
			},
			startWindow: collapseWindow,
		});
	};

	const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
		if (!dragState) {
			return;
		}

		event.stopPropagation();
		onChange(
			resizeRoiLocalRect({
				rect: dragState.startWindow,
				roi,
				mode: dragState.mode,
				dx: event.point.x - dragState.startPoint.x,
				dy: event.point.y - dragState.startPoint.y,
			}),
		);
	};

	const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
		if (!dragState) {
			return;
		}

		event.stopPropagation();
		releasePointer(event);
		setDragState(null);
	};

	return (
		<group>
			<RectOutline
				rect={worldRect}
				color={IMAGE_CANVAS_COLLAPSE_OUTLINE_COLOR}
				lineWidth={2}
				z={9.1}
			/>
			{Object.entries(hitAreas).map(([mode, rect]) =>
				rect.width > 0 && rect.height > 0 ? (
					<HitArea
						key={mode}
						rect={rect}
						mode={mode as DragMode}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
					/>
				) : null,
			)}
		</group>
	);
}
