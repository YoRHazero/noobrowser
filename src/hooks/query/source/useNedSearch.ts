import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import type { NedSearchResult } from "./schemas";

export function useNedSearch({
	ra,
	dec,
	radius,
	enabled = false,
}: {
	ra?: number;
	dec?: number;
	radius?: number;
	enabled?: boolean;
}) {
	const queryKey = [
		"ned-search",
		ra?.toFixed(10),
		dec?.toFixed(10),
		radius,
	];

	const query = useQueryAxiosGet<NedSearchResult[]>({
		queryKey,
		enabled: enabled && ra !== undefined && dec !== undefined && radius !== undefined,
		path: "/source/ned_search/",
		axiosGetParams: {
			params: {
				ra,
				dec,
				radius,
			},
		},
		checkParamsNull: false,
	});

	return query;
}
