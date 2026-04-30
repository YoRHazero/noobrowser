"use client";

import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { useImageInspectorStore } from "../../../../store";

export interface AnnotationLayerViewModel {
	sourceCount: number;
	activeSourceLabel: string;
	roiLabel: string;
	collapseWindowLabel: string;
	lockROI: boolean;
	onLockROIChange: (lockROI: boolean) => void;
}

export function useAnnotationLayer(): AnnotationLayerViewModel {
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);
	const { roi, lockROI, setLockROI } = useImageInspectorStore(
		useShallow((state) => ({
			roi: state.annotationLayerRoi,
			lockROI: state.lockROI,
			setLockROI: state.setLockROI,
		})),
	);
	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;

	return {
		sourceCount: sources.filter((source) => source.visibility.inspector).length,
		activeSourceLabel: activeSource?.label ?? activeSource?.id ?? "—",
		roiLabel: `ROI: (${roi.x}, ${roi.y}), ${roi.width} x ${roi.height} px`,
		collapseWindowLabel: `Lock ROI camera: ${lockROI ? "On" : "Off"}`,
		lockROI,
		onLockROIChange: setLockROI,
	};
}
