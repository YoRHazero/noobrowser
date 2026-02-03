import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";
import type { RoiState } from "@/stores/stores-types";

export type MoveConfig = {
	moveStep: number;
	jumpFactor: number;
	fastMoveStep: number;
};

export function useGrismNavigation(
	totalImages: number,
	moveConfig?: MoveConfig,
) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const setRoi = useGrismStore((state) => state.setRoiState);
	const setEmissionMaskMode = useGrismStore(
		(state) => state.setEmissionMaskMode,
	);
	const setFollowRoiCamera = useGrismStore(
		(state) => state.setFollowRoiCamera,
	);
	const setTraceMode = useSourcesStore((state) => state.setTraceMode);
	const setOpacity = useCounterpartStore((state) => state.setOpacity);
	const setDisplayMode = useCounterpartStore((state) => state.setDisplayMode);

	const moveStep = moveConfig?.moveStep ?? 1;
	const jumpFactor = moveConfig?.jumpFactor ?? 0.5;
	const fastMoveStep = moveConfig?.fastMoveStep ?? 10;

	const updateRoi = (updater: (prev: RoiState) => Partial<RoiState>) => {
		const { roiState } = useGrismStore.getState();
		const patch = updater(roiState);
		setRoi(patch);
	};
	const hotkeyConfig = {
		enableOnFromTags: false,
		preventDefault: true,
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Hot key                                  */
	/* -------------------------------------------------------------------------- */
	/* ------------------------------- Mode Switch ------------------------------ */
	useHotkeys(
		"shift+t",
		(e) => {
			e.preventDefault();
			setTraceMode(!useSourcesStore.getState().traceMode);
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+j",
		(e) => {
			e.preventDefault();
			setOpacity(useCounterpartStore.getState().opacity - 0.1);
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+k",
		(e) => {
			e.preventDefault();
			setOpacity(useCounterpartStore.getState().opacity + 0.1);
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+r",
		(e) => {
			e.preventDefault();
			const currentMode = useCounterpartStore.getState().displayMode;
			const nextMode =
				currentMode === "rgb"
					? "r"
					: currentMode === "r"
						? "g"
						: currentMode === "g"
							? "b"
							: "rgb";
			setDisplayMode(nextMode);
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+m",
		(e) => {
			e.preventDefault();
			const currentMode = useGrismStore.getState().emissionMaskMode;
			const nextMode =
				currentMode === "hidden"
					? "individual"
					: currentMode === "individual"
						? "total"
						: "hidden";
			setEmissionMaskMode(nextMode);
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+f",
		(e) => {
			e.preventDefault();
			setFollowRoiCamera(!useGrismStore.getState().followRoiCamera);
		},
		hotkeyConfig,
	);
	/* ------------------------------ Single arrow ------------------------------ */
	useHotkeys(
		"up",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y - moveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"down",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y + moveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"left",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x - moveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"right",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x + moveStep }));
		},
		hotkeyConfig,
	);
	/* ----------------------- cmd + arrow / ctrl + arrow ----------------------- */
	useHotkeys(
		"mod+up",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y - jumpFactor * prev.height }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"mod+down",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y + jumpFactor * prev.height }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"mod+left",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x - jumpFactor * prev.width }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"mod+right",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x + jumpFactor * prev.width }));
		},
		hotkeyConfig,
	);
	/* ------------------------------ shift + arrow ----------------------------- */
	useHotkeys(
		"shift+up",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y - fastMoveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+down",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ y: prev.y + fastMoveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+left",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x - fastMoveStep }));
		},
		hotkeyConfig,
	);
	useHotkeys(
		"shift+right",
		(e) => {
			e.preventDefault();
			updateRoi((prev) => ({ x: prev.x + fastMoveStep }));
		},
		hotkeyConfig,
	);
	/* ---------------------------- Image navigation ---------------------------- */
	useHotkeys(
		"shift+e",
		(e) => {
			e.preventDefault();
			setCurrentImageIndex((p) => (p + 1) % totalImages);
		},
		{ enabled: totalImages > 0 },
		[totalImages],
	);

	useHotkeys(
		"shift+q",
		(e) => {
			e.preventDefault();
			setCurrentImageIndex((p) => (p - 1 + totalImages) % totalImages);
		},
		{ enabled: totalImages > 0 },
		[totalImages],
	);
	return { currentImageIndex, setCurrentImageIndex };
}
