export interface OverviewFootprintVertex {
	ra: number;
	dec: number;
}

export interface OverviewFootprintRecord {
	id: string;
	vertices: OverviewFootprintVertex[];
}

export interface UseOverviewFootprintsResult {
	footprints: OverviewFootprintRecord[];
	isLoading: boolean;
}

export function useOverviewFootprints(): UseOverviewFootprintsResult {
	return {
		footprints: [],
		isLoading: false,
	};
}
