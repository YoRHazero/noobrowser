import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { useGrismStore, useCounterpartStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import { useThree } from "@react-three/fiber";
import type { MapControls } from "three-stdlib"
import type { RoiState } from "@/stores/stores-types";
import gsap from "gsap";

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
    const setOpacity = useCounterpartStore(state => state.setOpacity);
    const setDisplayMode = useCounterpartStore(state => state.setDisplayMode);

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
    useHotkeys("shift+j", (e) => {
        e.preventDefault();
        setOpacity(useCounterpartStore.getState().opacity - 0.1);
    }, hotkeyConfig);
    useHotkeys("shift+k", (e) => {
        e.preventDefault();
        setOpacity(useCounterpartStore.getState().opacity + 0.1);
    }, hotkeyConfig);
    useHotkeys("shift+r", (e) => {
        e.preventDefault();
        const currentMode = useCounterpartStore.getState().displayMode;
        const nextMode = currentMode === "rgb" ? "r" :
                         currentMode === "r" ? "g" :
                         currentMode === "g" ? "b" : "rgb";
        setDisplayMode(nextMode);
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

export function useFocusWithFlash(
	ref: React.RefObject<HTMLElement | null>,
	hotkey: string,
) {
	useHotkeys(
		hotkey,
		(e) => {
			e.preventDefault(); // 防止默认行为（如浏览器搜索等）
			if (ref.current) {
				// 1. 滚动到可视区域
				ref.current.scrollIntoView({ behavior: "smooth", block: "center" });

				// 2. GSAP 视觉提示：边框/阴影高亮闪烁
				// 假设你的组件有边框，我们让它发光一下
				// 注意：这里使用了 Chakra 的 CSS 变量，也可以用普通颜色 hex
				gsap.fromTo(
					ref.current,
					{
						borderColor: "var(--chakra-colors-teal-500)",
						boxShadow: "0 0 0 2px var(--chakra-colors-teal-500)",
					},
					{
						borderColor: "var(--chakra-colors-border-subtle)", // 恢复默认边框色
						boxShadow: "none",
						duration: 1.5,
						ease: "power2.out",
						clearProps: "all", // 动画结束后清除内联样式，避免污染
					},
				);
			}
		},
		{ enableOnFormTags: true }, // 允许在输入框中触发（可选，看你需求）
		[ref],
	);
}