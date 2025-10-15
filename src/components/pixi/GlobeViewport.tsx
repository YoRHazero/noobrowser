import { Viewport as BaseViewport, type IViewportOptions } from 'pixi-viewport'
import { useApplication, extend } from '@pixi/react'
import { Application } from 'pixi.js';
import { useRef, useCallback } from 'react';
import { useGlobeStore } from '@/stores/footprints';


// Todo: fix the bug that the onWheel event cannot be stopped to propagate to the parent element
// now this is temporarily fixed by using this.wheel() in the constructor, but this will cause the zoom center
// not to be fixed at the center.
type ViewportProps = Omit<IViewportOptions, 'events'> 
class CustomGlobeViewport extends BaseViewport {
    constructor(options: ViewportProps & {app: Application} ) {
        const {app, ...rest} = options;
        super({
            events: app.renderer.events,
            passiveWheel: false,
            ...rest
        })
        this.wheel().decelerate();
    }
}

extend({
    CustomGlobeViewport
})



export default function GlobeViewport( {children}: {children: React.ReactNode} ) {
    const {app} = useApplication();

    const view = useGlobeStore((state) => state.view);
    const setView = useGlobeStore((state) => state.setView);

    const dragging = useRef<{x: number, y: number} | null>(null);
    const viewportRef = useRef<CustomGlobeViewport | null>(null);

    const MinScale = 0.1;
    const MaxScale = 1000;

    const wrapDeg = (deg: number) => {
        let x = ((deg + 180) % 360 + 360) % 360 - 180;
        if (x === -180) x = 180;
        return x;
    }
    const clamp = (v: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, v));
    }

    const onPointerDown = useCallback((event: any) => {
        dragging.current = {x: event.data.global.x, y: event.data.global.y};
        if (viewportRef.current) {
            viewportRef.current.cursor = 'grabbing';
        }
    }, []);

    const onPointerUp = useCallback(() => {
        dragging.current = null;
        if (viewportRef.current) {
            viewportRef.current.cursor = 'grab';
        }
    }, []);

    const onPointerMove = useCallback((event: any) => {
        if (dragging.current) {
            const dx = event.data.global.x - dragging.current.x;
            const dy = event.data.global.y - dragging.current.y;
            dragging.current = {x: event.data.global.x, y: event.data.global.y};

            const sens = 0.3;
            setView({
                yawDeg: wrapDeg(view.yawDeg + dx * sens / view.scale),
                pitchDeg: clamp(view.pitchDeg + dy * sens / view.scale, -89, 89),
            });
        }
    }, [view.pitchDeg, view.yawDeg, setView]);

    const onWheel = useCallback((event: any) => {
        const factor = Math.exp(-event.deltaY * 0.0015);
        const next = clamp(view.scale * factor, MinScale, MaxScale);
        setView({scale: next});
    }, [view.scale, setView]);

    return (
        app?.renderer && (
        <pixiCustomGlobeViewport
            app={app}
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onWheel={onWheel}
        >
            {children}
        </pixiCustomGlobeViewport>
        )
    );
}