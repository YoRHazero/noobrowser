export interface OverviewCameraFlightTarget {
	id: string;
}

export function useCameraFlight() {
	return {
		flyTo: (_target: OverviewCameraFlightTarget) => undefined,
	};
}
