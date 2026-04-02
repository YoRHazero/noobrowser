import { useEffect } from "react";
import { BEACON_EFFECT_DURATION_MS } from "../shared/constants";
import { useTargetHubStore } from "../store";

export function useTargetHubFeedbackLifecycle() {
	const effectToken = useTargetHubStore((state) => state.effect?.token);
	const clearEffect = useTargetHubStore((state) => state.clearEffect);

	useEffect(() => {
		if (!effectToken) return undefined;

		const timer = window.setTimeout(() => {
			clearEffect();
		}, BEACON_EFFECT_DURATION_MS);

		return () => {
			window.clearTimeout(timer);
		};
	}, [clearEffect, effectToken]);
}
