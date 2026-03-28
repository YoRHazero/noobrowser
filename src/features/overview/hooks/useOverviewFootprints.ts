import { useGrismFootprints } from "@/hooks/query/overview";
import type { GrismFootprintItem } from "@/hooks/query/overview";
import type {
	EquatorialCoordinate,
	OverviewFootprintMeta,
	OverviewFootprintRecord,
} from "../utils/types";

export interface UseOverviewFootprintsParams {
	enabled?: boolean;
}

export interface UseOverviewFootprintsResult {
	footprints: OverviewFootprintRecord[];
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

function normalizeFootprint(
	item: GrismFootprintItem,
): OverviewFootprintRecord {
	const vertices: EquatorialCoordinate[] = item.footprint.vertices.map(
		([ra, dec]) => ({ ra, dec }),
	);
	const center: EquatorialCoordinate = {
		ra: item.footprint.center[0],
		dec: item.footprint.center[1],
	};
	const meta: OverviewFootprintMeta = {
		...(item.meta ?? {}),
	};

	return {
		id: item.id,
		vertices,
		center,
		meta,
	};
}

export function useOverviewFootprints({
	enabled = true,
}: UseOverviewFootprintsParams = {}): UseOverviewFootprintsResult {
	const query = useGrismFootprints({
		enabled,
	});

	return {
		footprints: (query.data ?? []).map(normalizeFootprint),
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ?? null,
	};
}
