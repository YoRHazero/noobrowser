"use client";

import { useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import {
	useGrismData,
	useGrismErr,
	useGrismOffsets,
} from "@/hooks/query/image";
import { useImageInspectorStore } from "../store";

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unknown error";
}

export default function BaseLayerFetchRuntime() {
	const request = useImageInspectorStore(
		(state) => state.baseLayerGrismFetchRequest,
	);
	const { setPending, setSucceeded, setFailed } = useImageInspectorStore(
		useShallow((state) => ({
			setPending: state.setBaseLayerGrismFetchPending,
			setSucceeded: state.setBaseLayerGrismFetchSucceeded,
			setFailed: state.setBaseLayerGrismFetchFailed,
		})),
	);
	const handledRequestIdRef = useRef<number | null>(null);
	const basenameList = useMemo(() => request?.basenameList ?? [], [request]);
	const dataQueries = useGrismData({
		basenameList,
		enabled: false,
	});
	const errQueries = useGrismErr({
		basenameList,
		enabled: false,
	});
	const offsetQueries = useGrismOffsets({
		groupId: request?.footprintId ?? null,
		basenameList,
		enabled: false,
	});

	useEffect(() => {
		if (!request || handledRequestIdRef.current === request.id) {
			return;
		}

		handledRequestIdRef.current = request.id;
		setPending(request.id);

		const grismQueries = [
			...Object.values(dataQueries),
			...Object.values(errQueries),
			...Object.values(offsetQueries),
		];

		if (grismQueries.length === 0) {
			const message = "No grism basenames found.";
			setFailed(request.id, message);
			toaster.error({
				title: "Failed to fetch grism images",
				description: message,
			});
			return;
		}

		void Promise.all(grismQueries.map((query) => query.refetch())).then(
			(results) => {
				const failedResult = results.find((result) => result.isError);

				if (failedResult) {
					const message = getErrorMessage(failedResult.error);
					setFailed(request.id, message);
					toaster.error({
						title: "Failed to fetch grism images",
						description: message,
					});
					return;
				}

				setSucceeded(request.id);
				toaster.success({
					title: "Grism fetch complete",
					description: `${request.basenameList.length} images fetched`,
				});
			},
		);
	}, [
		dataQueries,
		errQueries,
		offsetQueries,
		request,
		setFailed,
		setPending,
		setSucceeded,
	]);

	return null;
}
