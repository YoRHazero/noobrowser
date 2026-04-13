import { useCallback } from "react";
import type { Spectrum1DCanvasFitHandleDrag } from "../shared/types";
import { useSpectrum1DCanvasInteractionStore } from "../store/interactionStore";

export function useFitHandleDrag({
	commitFitModelEdit,
}: {
	commitFitModelEdit?: (modelId: number) => void;
}) {
	const drag = useSpectrum1DCanvasInteractionStore(
		(state) => state.fitHandleDrag,
	);
	const setFitHandleDrag = useSpectrum1DCanvasInteractionStore(
		(state) => state.setFitHandleDrag,
	);
	const clearFitHandleDrag = useSpectrum1DCanvasInteractionStore(
		(state) => state.clearFitHandleDrag,
	);
	const startDrag = useCallback(
		(nextDrag: Spectrum1DCanvasFitHandleDrag) => {
			setFitHandleDrag(nextDrag);
		},
		[setFitHandleDrag],
	);
	const updateDrag = useCallback(
		(nextDrag: Spectrum1DCanvasFitHandleDrag) => {
			setFitHandleDrag(nextDrag);
		},
		[setFitHandleDrag],
	);
	const endDrag = useCallback(
		(modelId?: number) => {
			const committedModelId =
				modelId ??
				useSpectrum1DCanvasInteractionStore.getState().fitHandleDrag?.modelId;
			clearFitHandleDrag();
			if (committedModelId !== undefined) {
				commitFitModelEdit?.(committedModelId);
			}
		},
		[clearFitHandleDrag, commitFitModelEdit],
	);

	return {
		drag,
		endDrag,
		isDragging: drag !== null,
		startDrag,
		updateDrag,
	};
}
