import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGlobeStore } from "@/stores/footprints";

export function useGlobeAnimation() {
    const setView = useGlobeStore((state) => state.setView);
    const animationRef = useRef<gsap.core.Animation | null>(null);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    const animateToView = useCallback((targetYaw: number, targetPitch: number, targetScale: number) => {
        if (animationRef.current) {
            animationRef.current.kill();
        }
        const currentView = useGlobeStore.getState().view;
        const diff = (targetYaw - currentView.yawDeg) % 360;
        const shortestDiff = ((2 * diff) % 360) - diff;
        const finalTargetYaw = currentView.yawDeg + shortestDiff;

        const proxyObj = {
            yaw: currentView.yawDeg,
            pitch: currentView.pitchDeg,
            scale: currentView.scale,
        };

        const timeline = gsap.timeline({
            onUpdate: () => {
                setView({
                    yawDeg: proxyObj.yaw,
                    pitchDeg: proxyObj.pitch,
                    scale: proxyObj.scale,
                })
            },
            onComplete: () => {
                animationRef.current = null;
            }
        })

        animationRef.current = timeline;
        if (currentView.scale > 1 && targetScale > 1) {
            const totalDuration = 2.0;
            const midDuration = totalDuration * 0.5;
            
            // rotation
            timeline.to(proxyObj, {
                yaw: finalTargetYaw,
                pitch: targetPitch,
                duration: totalDuration,
                ease: "power2.inOut",
            }, 0);
            // zoom out and in
            timeline.to(proxyObj, {
                scale: 1,
                duration: midDuration,
                ease: "power2.inOut",
            }, 0);
            timeline.to(proxyObj, {
                scale: targetScale,
                duration: midDuration,
                ease: "power2.inOut",
            }, midDuration);
        } else {
            timeline.to(proxyObj, {
                yaw: finalTargetYaw,
                pitch: targetPitch,
                scale: targetScale,
                duration: 1.5,
                ease: "power3.inOut",
            }, 0);
        }
    }, [setView]);

    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            animationRef.current.kill();
            animationRef.current = null;
        }
    }, []);

    return { animateToView, stopAnimation };
}