import { useMemo } from "react";
import {
	useGrismFootprints,
	type UseGrismFootprintsParams,
	type GrismFootprintItem,
} from "@/hooks/query/overview";
import type { OverviewFootprintRecord, WorldCoordinate } from "../utils/types";

export interface UseOverviewFootprintsParams extends UseGrismFootprintsParams {}

export interface UseOverviewFootprintsResult {
	footprints: OverviewFootprintRecord[];
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

function normalizeFootprint(item: GrismFootprintItem): OverviewFootprintRecord {
	const vertices: WorldCoordinate[] = item.footprint.vertices.map(([ra, dec]) => ({
		ra,
		dec,
	}));

	return {
		id: item.id,
		vertices,
		center: {
			ra: item.footprint.center[0],
			dec: item.footprint.center[1],
		},
		meta: {
			...(item.meta ?? {}),
		},
	};
}

export function useOverviewFootprints({
	enabled = true,
}: UseOverviewFootprintsParams = {}): UseOverviewFootprintsResult {
	const query = useGrismFootprints({
		enabled,
	});
	const footprints = useMemo(
		() => (query.data ?? []).map(normalizeFootprint),
		[query.data],
	);

	return {
		footprints,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ?? null,
	};
}
