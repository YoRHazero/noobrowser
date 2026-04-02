import { useEffect, useRef } from "react";
import { BEACON_EFFECT_ATTENTION_MS } from "../../shared/constants";
import { useTargetHubStore } from "../../store";

export function useBeaconAttentionFromEffect() {
	const effectToken = useTargetHubStore((state) => state.effect?.token);
	const setReveal = useTargetHubStore((state) => state.setReveal);
	const attentionTimerRef = useRef<number | null>(null);

	useEffect(() => {
		if (!effectToken) return;

		if (attentionTimerRef.current) {
			window.clearTimeout(attentionTimerRef.current);
			attentionTimerRef.current = null;
		}

		const state = useTargetHubStore.getState();
		const shouldPeek =
			state.mode === "icon" && state.reveal === "hidden" && !state.isDragging;

		if (!shouldPeek) {
			return;
		}

		setReveal("peek");

		attentionTimerRef.current = window.setTimeout(() => {
			const current = useTargetHubStore.getState();
			const noNewerEffect =
				current.effect == null || current.effect.token === effectToken;

			if (
				noNewerEffect &&
				current.mode === "icon" &&
				current.reveal === "peek" &&
				!current.isDragging
			) {
				setReveal("hidden");
			}
		}, BEACON_EFFECT_ATTENTION_MS);
	}, [effectToken, setReveal]);

	useEffect(
		() => () => {
			if (attentionTimerRef.current) {
				window.clearTimeout(attentionTimerRef.current);
			}
		},
		[],
	);
}
