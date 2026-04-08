import { useEffect } from "react";
import { BEACON_EFFECT_DURATION_MS } from "../shared/constants";
import { useFeedbackStore } from "../store/useFeedbackStore";

export function useFeedbackLifecycle() {
	const effectToken = useFeedbackStore((state) => state.effect?.token);
	const clearEffect = useFeedbackStore((state) => state.clearEffect);

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
