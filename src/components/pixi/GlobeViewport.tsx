import { useApplication, useTick, extend } from '@pixi/react';
import { FederatedPointerEvent, FederatedWheelEvent, Container } from 'pixi.js';
import { useRef, useCallback, useEffect } from 'react';
import { useGlobeStore } from '@/stores/footprints';
import { useGlobeAnimation } from '@/hook/animation-hook';
import { wrapDeg180, clamp } from '@/utils/projection';

extend({ Container });

const FRICTION = 0.90;
const STOP_THRESHOLD = 0.01;
const MIN_SCALE = 0.1;
const MAX_SCALE = 1000;
const SENSITIVITY = 1;
const ZOOM_SENSITIVITY = 0.0015;

export default function GlobeViewport( {children}: {children: React.ReactNode} ) {
    const {app} = useApplication();

    const view = useGlobeStore((state) => state.view);
    const setView = useGlobeStore((state) => state.setView);
    const viewRef = useRef(view);

    useEffect(() => {
        const unsubscribe = useGlobeStore.subscribe((state) => {
            viewRef.current = state.view;
        });
        return unsubscribe;
    }, []);

    const isDragging = useRef(false);
    const lastMousePos = useRef<{x: number, y: number} | null>(null);
    const velocity = useRef<{vx: number, vy: number}>({vx: 0, vy: 0});

    useTick((ticker) => {
        if (isDragging.current) return;

        if (Math.abs(velocity.current.vx) < STOP_THRESHOLD && Math.abs(velocity.current.vy) < STOP_THRESHOLD) return;

        const delta = ticker.deltaTime;
        const currentScale = viewRef.current.scale;
        const deltaYaw = (velocity.current.vx / currentScale) * delta;
        const deltaPitch = (velocity.current.vy / currentScale) * delta;

        const newYaw = wrapDeg180(viewRef.current.yawDeg - deltaYaw);
        const newPitch = clamp(viewRef.current.pitchDeg - deltaPitch, -89.5, 89.5);

        setView({ yawDeg: newYaw, pitchDeg: newPitch });

        velocity.current.vx *= FRICTION;
        velocity.current.vy *= FRICTION;
    })
    const { stopAnimation } = useGlobeAnimation();

    const onPointerDown = useCallback((event: FederatedPointerEvent) => {
        event.stopPropagation();
        stopAnimation();
        isDragging.current = true;
        lastMousePos.current = { x: event.global.x, y: event.global.y };
        velocity.current = { vx: 0, vy: 0 };

        if (app?.renderer) {
            app.renderer.events.cursorStyles.default = 'grabbing';
            app.renderer.events.setCursor('grabbing');
        }
    }, [app, stopAnimation]);

    const onPointerUp = useCallback(() => {
        isDragging.current = false;
        lastMousePos.current = null;

        if (app?.renderer) {
            app.renderer.events.cursorStyles.default = 'default';
            app.renderer.events.setCursor('default');
        }
    }, [app]);

    const onGlobalPointerMove = useCallback((event: FederatedPointerEvent) => {
        if (!isDragging.current || !lastMousePos.current) return;

        const currentX = event.global.x;
        const currentY = event.global.y;

        const dx = currentX - lastMousePos.current.x;
        const dy = currentY - lastMousePos.current.y;

        lastMousePos.current = { x: currentX, y: currentY };

        const currentScale = viewRef.current.scale;
        setView({
            yawDeg: wrapDeg180(viewRef.current.yawDeg + dx * SENSITIVITY / currentScale),
            pitchDeg: clamp(viewRef.current.pitchDeg + dy * SENSITIVITY / currentScale, -89.5, 89.5)
        });

        velocity.current = { vx: -dx * SENSITIVITY, vy: -dy * SENSITIVITY };
    }, [setView]);

    const onWheel = useCallback((event: FederatedWheelEvent) => {
        stopAnimation();
        velocity.current = { vx: 0, vy: 0 };
        const factor = Math.exp(-ZOOM_SENSITIVITY * event.deltaY);
        const nextScale = clamp(viewRef.current.scale * factor, MIN_SCALE, MAX_SCALE);
        setView({ scale: nextScale });
    }, [setView, stopAnimation]);

    useEffect(() => {
        if (!app || !app.canvas) return;
        const canvas = app.canvas as HTMLCanvasElement;
        const stopper = (e: WheelEvent) => e.preventDefault();
        canvas.addEventListener('wheel', stopper, { passive: false });
        return () => {
            canvas.removeEventListener('wheel', stopper);
        };
    }, [app]);

    return (
        <pixiContainer
            hitArea={app?.screen}
            eventMode='static'
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