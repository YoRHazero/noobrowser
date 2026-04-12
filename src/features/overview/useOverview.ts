import { useShallow } from "zustand/react/shallow";
import { useOverviewMapCanvas } from "./hooks/useOverviewMapCanvas";
import { useOverviewSelectionValidity } from "./hooks/useOverviewSelectionValidity";
import { useOverviewUiStore } from "./store";

export function useOverview() {
	useOverviewSelectionValidity();
	const { actions: mapCanvasActions, model: mapCanvasModel } =
		useOverviewMapCanvas();
	const { mapCanvasMounted, setMapCanvasMounted } = useOverviewUiStore(
		useShallow((state) => ({
			mapCanvasMounted: state.mapCanvasMounted,
			setMapCanvasMounted: state.setMapCanvasMounted,
		})),
	);

	return {
		mapCanvasActions,
		mapCanvasMounted,
		mapCanvasModel,
		setMapCanvasMounted,
	};
}
