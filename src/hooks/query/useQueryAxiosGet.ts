import {
	type QueryFunctionContext,
	type QueryKey,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import axios, { type AxiosProgressEvent, type AxiosRequestConfig } from "axios";
import { useState } from "react";
import { useConnectionStore } from "@/stores/connection";

type QueryAxiosParams<T = unknown> = {
	queryKey: QueryKey;
	path: string;
	enabled?: boolean;
	axiosGetParams?: AxiosRequestConfig;
	returnType?: "response" | "data";
	queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">;
	checkParamsNull?: boolean;
};
/**
 * Hook to perform axios GET request with react-query
 * @param params QueryAxiosParams<T>
 * @param params.queryKey Query key for react-query
 * @param params.path API endpoint path
 * @param params.enabled Whether the query is enabled
 * @param params.axiosGetParams Parameters to pass to axios.get
 * @param params.returnType 'response' to return full response, 'data' to return response data (default: 'data')
 * @param params.queryOptions Additional react-query options
 * @param params.checkParamsNull Whether to check for null/undefined in axiosGetParams.params (default: true)
 * @returns useQuery result
 */
export function useQueryAxiosGet<T = unknown>(params: QueryAxiosParams<T>) {
	const {
		queryKey,
		path,
		axiosGetParams = {},
		returnType = "data",
		queryOptions = {},
		checkParamsNull = true,
	} = params;
	const isConnected = useConnectionStore((state) => state.isConnected);

	const [downloadProgress, setDownloadProgress] = useState<number>(0);
	let enabled = (params.enabled ?? true) && isConnected;
	if (axiosGetParams?.params && checkParamsNull) {
		const paramsHasNull = Object.values(axiosGetParams.params).some(
			(v) => v === null || v === undefined,
		);
		enabled = enabled && !paramsHasNull;
	}

	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const queryFn = async ({ signal }: QueryFunctionContext) => {
		setDownloadProgress(0);
		const axiosConfig: AxiosRequestConfig = {
			...axiosGetParams,
			signal,
			onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
				if (progressEvent.total) {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total,
					);
					setDownloadProgress(percentCompleted);
				}
				if (axiosGetParams.onDownloadProgress) {
					axiosGetParams.onDownloadProgress(progressEvent);
				}
			},
		};

		if (returnType === "response") {
			return axios.get(backendUrl + path, axiosConfig);
		}
		if (returnType === "data") {
			return axios.get(backendUrl + path, axiosConfig).then((res) => res.data);
		}
		throw new Error(`Invalid returnType: ${returnType}`);
	};

	const query = useQuery<T>({
		queryKey,
		enabled,
		queryFn,
		...queryOptions,
	});

	return { ...query, downloadProgress };
}
