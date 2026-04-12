import { useOverviewMapCanvas } from "./hooks/useOverviewMapCanvas";
import { useOverviewSelectionValidity } from "./hooks/useOverviewSelectionValidity";

export function useOverview() {
	useOverviewSelectionValidity();
	const { actions: mapCanvasActions, model: mapCanvasModel } =
		useOverviewMapCanvas();

	return {
		mapCanvasActions,
		mapCanvasModel,
	};
}
