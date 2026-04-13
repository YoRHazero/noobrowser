import { useCallback, useState } from "react";
import type { Spectrum1DCanvasFitHandleDrag } from "../shared/types";

export function useFitHandleDrag({
	commitFitModelEdit,
}: {
	commitFitModelEdit?: (modelId: number) => void;
}) {
	const [drag, setDrag] = useState<Spectrum1DCanvasFitHandleDrag | null>(null);
	const startDrag = useCallback((nextDrag: Spectrum1DCanvasFitHandleDrag) => {
		setDrag(nextDrag);
	}, []);
	const updateDrag = useCallback((nextDrag: Spectrum1DCanvasFitHandleDrag) => {
		setDrag(nextDrag);
	}, []);
	const endDrag = useCallback(
		(modelId?: number) => {
			const committedModelId = modelId ?? drag?.modelId;
			setDrag(null);
			if (committedModelId !== undefined) {
				commitFitModelEdit?.(committedModelId);
			}
		},
		[commitFitModelEdit, drag],
	);

	return {
		drag,
		endDrag,
		isDragging: drag !== null,
		startDrag,
		updateDrag,
	};
}
