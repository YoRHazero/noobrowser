export interface UseOverviewSelectionResult {
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
}

export function useOverviewSelection(): UseOverviewSelectionResult {
	return {
		selectedFootprintId: null,
		hoveredFootprintId: null,
	};
}
