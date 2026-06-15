"use client";

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useCounterpartImage } from "@/hooks/query/image";
import { IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS } from "../shared/constants";
import type { ReferenceLayerFilterRgb } from "../shared/types";
import { useImageInspectorStore } from "../store";

const EMPTY_FILTER_RGB: ReferenceLayerFilterRgb = {
	r: "",
	g: "",
	b: "",
};

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unknown error";
}

export default function CounterpartImageRuntime() {
	const request = useImageInspectorStore(
		(state) => state.referenceCounterpartFetchRequest,
	);
	const { setPending, setSucceeded, setFailed } = useImageInspectorStore(
		useShallow((state) => ({
			setPending: state.setReferenceCounterpartFetchPending,
			setSucceeded: state.setReferenceCounterpartFetchSucceeded,
			setFailed: state.setReferenceCounterpartFetchFailed,
		})),
	);
	const handledRequestIdRef = useRef<number | null>(null);
	const filterRgb = request?.filterRgb ?? EMPTY_FILTER_RGB;
	const counterpartImageQuery = useCounterpartImage({
		selectedFootprintId: request?.footprintId ?? null,
		r: filterRgb.r,
		g: filterRgb.g,
		b: filterRgb.b,
		normParams: IMAGE_INSPECTOR_COUNTERPART_NORM_PARAMS,
		enabled: false,
	});

	useEffect(() => {
		if (!request || handledRequestIdRef.current === request.id) {
			return;
		}

		handledRequestIdRef.current = request.id;
		setPending(request.id);

		void counterpartImageQuery.refetch().then((result) => {
			if (result.isError) {
				const message = getErrorMessage(result.error);
				setFailed(request.id, message);
				toaster.error({
					title: "Failed to fetch counterpart image",
					description: message,
				});
				return;
			}

			setSucceeded(request.id);
			toaster.success({
				title: "Counterpart image fetch complete",
				description: `${request.filterRgb.r}/${request.filterRgb.g}/${request.filterRgb.b}`,
			});
		});
	}, [counterpartImageQuery, request, setFailed, setPending, setSucceeded]);

	return null;
}
