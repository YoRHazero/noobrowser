import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";
import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { useConnectionStore } from "@/stores/connection";
import { useOverviewStore } from "@/stores/overview";
import type { SourcePosition } from "./schemas";

export interface SourcePositionQueryInput {
	selectedFootprintId?: string | null;
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
	enabled?: boolean;
}

function createSourcePositionQueryKey({
	group_id,
	x,
	y,
	ra,
	dec,
	ref_basename,
}: {
	group_id: string | null | undefined;
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
}) {
	return [
		"source-position",
		x?.toFixed(1),
		y?.toFixed(1),
		ra,
		dec,
		ref_basename,
		group_id,
	];
}

function hasValidSourcePositionInput({
	x,
	y,
	ra,
	dec,
}: Pick<SourcePositionQueryInput, "x" | "y" | "ra" | "dec">) {
	const hasAvailableXY = x !== undefined && y !== undefined;
	const hasAvailableRaDec = ra !== undefined && dec !== undefined;
	return hasAvailableXY || hasAvailableRaDec;
}

function createSourcePositionParams({
	group_id,
	x,
	y,
	ra,
	dec,
	ref_basename,
}: {
	group_id: string | null | undefined;
	x?: number;
	y?: number;
	ra?: number;
	dec?: number;
	ref_basename?: string;
}) {
	return {
		group_id,
		x,
		y,
		ra,
		dec,
		ref_basename,
	};
}

export function useSourcePosition({
	selectedFootprintId,
	x,
	y,
	ra,
	dec,
	ref_basename,
	enabled = false,
}: SourcePositionQueryInput) {
	const overviewSelectedFootprintId = useOverviewStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? overviewSelectedFootprintId;
	const queryKey = createSourcePositionQueryKey({
		group_id,
		x,
		y,
		ra,
		dec,
		ref_basename,
	});
	const isValidInput = hasValidSourcePositionInput({ x, y, ra, dec });
	const query = useQueryAxiosGet<SourcePosition>({
		queryKey,
		enabled:
			enabled && group_id !== null && group_id !== undefined && isValidInput,
		path: "/source/source_position/",
		axiosGetParams: {
			params: createSourcePositionParams({
				group_id: group_id,
				x: x,
				y: y,
				ra: ra,
				dec: dec,
				ref_basename: ref_basename,
			}),
		},
		checkParamsNull: false,
	});
	return query;
}

export function useSourcePositionFetcher() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const isConnected = useConnectionStore((state) => state.isConnected);
	const queryClient = useQueryClient();

	return useCallback(
		async ({
			selectedFootprintId,
			x,
			y,
			ra,
			dec,
			ref_basename,
		}: Omit<SourcePositionQueryInput, "enabled">) => {
			const group_id = selectedFootprintId ?? null;
			if (
				!isConnected ||
				group_id === null ||
				!hasValidSourcePositionInput({ x, y, ra, dec })
			) {
				return null;
			}

			return queryClient.fetchQuery<SourcePosition>({
				queryKey: createSourcePositionQueryKey({
					group_id,
					x,
					y,
					ra,
					dec,
					ref_basename,
				}),
				queryFn: async ({ signal }) =>
					axios
						.get(`${backendUrl}/source/source_position/`, {
							signal,
							params: createSourcePositionParams({
								group_id,
								x,
								y,
								ra,
								dec,
								ref_basename,
							}),
						})
						.then((response) => response.data as SourcePosition),
			});
		},
		[backendUrl, isConnected, queryClient],
	);
}
