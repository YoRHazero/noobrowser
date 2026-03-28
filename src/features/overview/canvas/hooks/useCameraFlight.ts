import { useEffect } from "react";

export interface UseCameraFlightParams {
	pendingFlyToTargetId: string | null;
}

export interface UseCameraFlightResult {
	hasPendingFlyToTarget: boolean;
	pendingFlyToTargetId: string | null;
}

export function useCameraFlight({
	pendingFlyToTargetId,
}: UseCameraFlightParams) {
	useEffect(() => {
		if (!pendingFlyToTargetId) return;
		// Reserved for future fly-to choreography.
	}, [pendingFlyToTargetId]);

	const result: UseCameraFlightResult = {
		hasPendingFlyToTarget: pendingFlyToTargetId !== null,
		pendingFlyToTargetId,
	};
	return result;
}
