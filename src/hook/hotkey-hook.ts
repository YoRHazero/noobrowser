import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import { useThree } from "@react-three/fiber";
import type { MapControls } from "three-stdlib"
import gsap from "gsap";

export type RoiState = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type MoveConfig = {
    moveStep: number;
    jumpFactor: number;
    fastMoveStep: number;
}

export function useGrismNavigation(
    totalImages: number,
    moveConfig?: MoveConfig,
) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const setRoi = useGrismStore(state => state.setRoiState);
    const setTraceMode = useSourcesStore(state => state.setTraceMode);

    const moveStep = moveConfig?.moveStep ?? 1;
    const jumpFactor = moveConfig?.jumpFactor ?? 0.5;
    const fastMoveStep = moveConfig?.fastMoveStep ?? 10;

    const updateRoi = (updater: (prev: RoiState) => Partial<RoiState>) => {
        const { roiState } = useGrismStore.getState();
        const patch = updater(roiState);
        setRoi(patch);
    }
    const hotkeyConfig = {
        enableOnFromTags: false,
        preventDefault: true,
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Hot key                                  */
    /* -------------------------------------------------------------------------- */
    /* ------------------------------- Mode Switch ------------------------------ */
    useHotkeys("shift+t", (e) => {
        e.preventDefault();
        setTraceMode(!useSourcesStore.getState().traceMode);
    }, hotkeyConfig);
    /* ------------------------------ Single arrow ------------------------------ */
    useHotkeys("up", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y - moveStep }) );
    }, hotkeyConfig);
    useHotkeys("down", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y + moveStep }) );
    }, hotkeyConfig);
    useHotkeys("left", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x - moveStep }) );
    }, hotkeyConfig);
    useHotkeys("right", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x + moveStep }) );
    }, hotkeyConfig);
    /* ----------------------- cmd + arrow / ctrl + arrow ----------------------- */
    useHotkeys("mod+up", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y - jumpFactor * prev.height }) );
    }, hotkeyConfig);
    useHotkeys("mod+down", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y + jumpFactor * prev.height }) );
    }, hotkeyConfig);
    useHotkeys("mod+left", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x - jumpFactor * prev.width }) );
    }, hotkeyConfig);
    useHotkeys("mod+right", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x + jumpFactor * prev.width }) );
    }, hotkeyConfig);
    /* ------------------------------ shift + arrow ----------------------------- */
    useHotkeys("shift+up", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y - fastMoveStep }) );
    }, hotkeyConfig);
    useHotkeys("shift+down", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ y: prev.y + fastMoveStep }) );
    }, hotkeyConfig);
    useHotkeys("shift+left", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x - fastMoveStep }) );
    }, hotkeyConfig);
    useHotkeys("shift+right", (e) => {
        e.preventDefault();
        updateRoi(prev => ({ x: prev.x + fastMoveStep }) );
    }, hotkeyConfig);
    /* ---------------------------- Image navigation ---------------------------- */
    useHotkeys("shift+e", (e) => {
        e.preventDefault();
        setCurrentImageIndex(p => (p + 1) % totalImages);
    }, { enabled: totalImages > 0 }, [totalImages]);
    
    useHotkeys("shift+q", (e) => {
        e.preventDefault();
        setCurrentImageIndex(p => (p - 1 + totalImages) % totalImages);
    }, { enabled: totalImages > 0 }, [totalImages]);
    return { currentImageIndex, setCurrentImageIndex};
}

export function useCameraCenteringOnRoi(controlRef: React.RefObject<MapControls | null>) {
    const roiState = useGrismStore(state => state.roiState);
    const { camera } = useThree();
    useHotkeys("shift+c", (e) => {
        e.preventDefault();
        const controls = controlRef.current;
        if (!controls || !camera || !roiState) return;
        
        const roiCenterX = roiState.x + roiState.width / 2;
        const roiCenterY = roiState.y + roiState.height / 2;

        gsap.killTweensOf(controls.target);
        gsap.killTweensOf(camera.position);
        
        gsap.to(controls.target, {
            x: roiCenterX,
            y: -roiCenterY,
            z: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onUpdate: () => {
                controls.update();
            }
        });
        
        const cameraZ = camera.position.z;
        gsap.to(camera.position, {
            x: roiCenterX,
            y: -roiCenterY,
            z: cameraZ,
            duration: 0.5,
            ease: "power3.inOut",
        });

        controls.update();
    }, [roiState, camera, controlRef]);
}