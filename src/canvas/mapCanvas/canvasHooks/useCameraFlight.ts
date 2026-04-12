import { useEffect } from "react";

export interface UseCameraFlightParams {
	focusFootprintId: string | null;
}

export interface UseCameraFlightResult {
	hasPendingFlight: boolean;
	focusFootprintId: string | null;
}

export function useCameraFlight({ focusFootprintId }: UseCameraFlightParams) {
	useEffect(() => {
		if (!focusFootprintId) return;
		// Reserved for future fly-to choreography.
	}, [focusFootprintId]);

	return {
		hasPendingFlight: focusFootprintId !== null,
		focusFootprintId,
	};
}
