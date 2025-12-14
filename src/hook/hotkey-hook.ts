import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { useGrismStore } from "@/stores/image";

export type RoiState = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type MoveConfig = {
    moveStep: number;
    jumpFactor: number;
}

export function useGrismNavigation(
    totalImages: number,
    moveConfig?: MoveConfig,
) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const setRoi = useGrismStore(state => state.setRoiState);

    const moveStep = moveConfig?.moveStep ?? 1;
    const jumpFactor = moveConfig?.jumpFactor ?? 0.5;

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
