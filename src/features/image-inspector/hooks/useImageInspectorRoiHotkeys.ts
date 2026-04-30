"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { IMAGE_INSPECTOR_ROI_SIZE } from "../shared/constants";
import { useImageInspectorStore } from "../store";

const ARROW_STEP = 10;
const PRECISE_STEP = 1;
const JUMP_STEP = IMAGE_INSPECTOR_ROI_SIZE / 2;

const HOTKEY_OPTIONS = {
	enableOnFormTags: false,
	preventDefault: true,
} as const;

export function useImageInspectorRoiHotkeys() {
	const moveRoiBy = useImageInspectorStore(
		(state) => state.moveAnnotationLayerRoiBy,
	);
	const setLockROI = useImageInspectorStore((state) => state.setLockROI);

	useHotkeys(
		"shift+c",
		(event) => {
			event.preventDefault();
			setLockROI(!useImageInspectorStore.getState().lockROI);
		},
		HOTKEY_OPTIONS,
		[setLockROI],
	);

	useHotkeys(
		"up",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: ARROW_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"down",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: -ARROW_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"left",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: -ARROW_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"right",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: ARROW_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"shift+up",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: JUMP_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"shift+down",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: -JUMP_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"shift+left",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: -JUMP_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"shift+right",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: JUMP_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"mod+up",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: PRECISE_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"mod+down",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: 0, dy: -PRECISE_STEP });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"mod+left",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: -PRECISE_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
	useHotkeys(
		"mod+right",
		(event) => {
			event.preventDefault();
			moveRoiBy({ dx: PRECISE_STEP, dy: 0 });
		},
		HOTKEY_OPTIONS,
		[moveRoiBy],
	);
}
