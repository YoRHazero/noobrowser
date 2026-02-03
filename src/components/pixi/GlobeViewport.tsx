import { extend, useApplication, useTick } from "@pixi/react";
import {
	Container,
	type FederatedPointerEvent,
	type FederatedWheelEvent,
} from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGlobeAnimation } from "@/features/footprint/hooks/animation-hook";
import { useGlobeStore } from "@/stores/footprints";
import { clamp, wrapDeg180 } from "@/utils/projection";

extend({ Container });

const FRICTION = 0.9;
const STOP_THRESHOLD = 0.01;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1000;
const SENSITIVITY = 1;
const ZOOM_SENSITIVITY = 0.0015;

export default function GlobeViewport({
	children,
}: {
	children: React.ReactNode;
}) {
	const { app } = useApplication();

	const { view, setView } = useGlobeStore(
		useShallow((state) => ({
			view: state.view,
			setView: state.setView,
		})),
	);
	const { stopAnimation } = useGlobeAnimation();
	const viewRef = useRef(view);

	useEffect(() => {
		const unsubscribe = useGlobeStore.subscribe((state) => {
			viewRef.current = state.view;
		});
		return unsubscribe;
	}, []);

	const isDragging = useRef(false);
	const lastMousePos = useRef<{ x: number; y: number } | null>(null);
	const velocity = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });

	useTick((ticker) => {
		if (isDragging.current) return;

		if (
			Math.abs(velocity.current.vx) < STOP_THRESHOLD &&
			Math.abs(velocity.current.vy) < STOP_THRESHOLD
		)
			return;

		const delta = ticker.deltaTime;
		const currentScale = viewRef.current.scale;
		const deltaYaw = (velocity.current.vx / currentScale) * delta;
		const deltaPitch = (velocity.current.vy / currentScale) * delta;

		const newYaw = wrapDeg180(viewRef.current.yawDeg + deltaYaw);
		const newPitch = clamp(viewRef.current.pitchDeg - deltaPitch, -89.5, 89.5);

		setView({ yawDeg: newYaw, pitchDeg: newPitch });

		velocity.current.vx *= FRICTION;
		velocity.current.vy *= FRICTION;
	});

	const onPointerDown = useCallback(
		(event: FederatedPointerEvent) => {
			event.stopPropagation();
			stopAnimation();
			isDragging.current = true;
			lastMousePos.current = { x: event.global.x, y: event.global.y };
			velocity.current = { vx: 0, vy: 0 };

			if (app?.renderer) {
				app.renderer.events.cursorStyles.default = "grabbing";
				app.renderer.events.setCursor("grabbing");
			}
		},
		[app, stopAnimation],
	);

	const onPointerUp = useCallback(() => {
		isDragging.current = false;
		lastMousePos.current = null;

		if (app?.renderer) {
			app.renderer.events.cursorStyles.default = "grab";
			app.renderer.events.setCursor("grab");
		}
	}, [app]);

	const onGlobalPointerMove = useCallback(
		(event: FederatedPointerEvent) => {
			if (!isDragging.current || !lastMousePos.current) return;

			const currentX = event.global.x;
			const currentY = event.global.y;

			const dx = currentX - lastMousePos.current.x;
			const dy = currentY - lastMousePos.current.y;

			lastMousePos.current = { x: currentX, y: currentY };

			const currentScale = viewRef.current.scale;
			setView({
				yawDeg: wrapDeg180(
					viewRef.current.yawDeg - (dx * SENSITIVITY) / currentScale,
				),
				pitchDeg: clamp(
					viewRef.current.pitchDeg + (dy * SENSITIVITY) / currentScale,
					-89.5,
					89.5,
				),
			});

			velocity.current = { vx: -dx * SENSITIVITY, vy: -dy * SENSITIVITY };
		},
		[setView],
	);

	const onWheel = useCallback(
		(event: FederatedWheelEvent) => {
			stopAnimation();
			velocity.current = { vx: 0, vy: 0 };
			const factor = Math.exp(-ZOOM_SENSITIVITY * event.deltaY);
			const nextScale = clamp(
				viewRef.current.scale * factor,
				MIN_SCALE,
				MAX_SCALE,
			);
			setView({ scale: nextScale });
		},
		[setView, stopAnimation],
	);
	const appCanvas =
		app === undefined || app.renderer === undefined
			? null
			: (app.canvas as HTMLCanvasElement | null);
	useEffect(() => {
		if (!app?.renderer || !appCanvas) return;
		const stopper = (e: WheelEvent) => e.preventDefault();
		appCanvas.addEventListener("wheel", stopper, { passive: false });
		return () => {
			appCanvas.removeEventListener("wheel", stopper);
		};
	}, [app, appCanvas]);

	if (!app || !app.renderer || !appCanvas) {
		return null;
	}
	return (
		<pixiContainer
			hitArea={app.screen}
			eventMode="static"
			onPointerDown={onPointerDown}
			onPointerUp={onPointerUp}
			onPointerUpOutside={onPointerUp}
			onGlobalPointerMove={onGlobalPointerMove}
			onWheel={onWheel}
		>
			{children}
		</pixiContainer>
	);
}
