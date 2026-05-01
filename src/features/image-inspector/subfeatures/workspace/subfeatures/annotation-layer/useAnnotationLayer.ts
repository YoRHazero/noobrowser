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
	const { roi, lockROI, sourceCount, setLockROI } = useImageInspectorStore(
		useShallow((state) => ({
			roi: state.annotationLayerRoi,
			lockROI: state.lockROI,
			sourceCount: state.annotationLayerSources.length,
			setLockROI: state.setLockROI,
		})),
	);
	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;

	return {
		sourceCount,
		activeSourceLabel: activeSource?.label ?? activeSource?.id ?? "—",
		roiLabel: `ROI: (${roi.x}, ${roi.y}), ${roi.width} x ${roi.height} px`,
		collapseWindowLabel: `Lock ROI camera: ${lockROI ? "On" : "Off"}`,
		lockROI,
		onLockROIChange: setLockROI,
	};
}
