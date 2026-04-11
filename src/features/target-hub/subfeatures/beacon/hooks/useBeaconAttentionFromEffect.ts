import { useEffect, useRef } from "react";
import { BEACON_EFFECT_ATTENTION_MS } from "../../../shared/constants";
import { getAnchorState } from "../../../store/useAnchorStore";
import {
	getFeedbackState,
	useFeedbackStore,
} from "../../../store/useFeedbackStore";
import { getShellState } from "../../../store/useShellStore";
import { getBeaconState, useBeaconStore } from "../store/useBeaconStore";

export function useBeaconAttentionFromEffect() {
	const effectToken = useFeedbackStore((state) => state.effect?.token);
	const setReveal = useBeaconStore((state) => state.setReveal);
	const attentionTimerRef = useRef<number | null>(null);

	useEffect(() => {
		if (!effectToken) return;

		if (attentionTimerRef.current) {
			window.clearTimeout(attentionTimerRef.current);
			attentionTimerRef.current = null;
		}

		const shellState = getShellState();
		const beaconState = getBeaconState();
		const anchorState = getAnchorState();
		const shouldPeek =
			shellState.mode === "icon" &&
			beaconState.reveal === "hidden" &&
			!anchorState.isAnchorDragging;

		if (!shouldPeek) {
			return;
		}

		setReveal("peek");

		attentionTimerRef.current = window.setTimeout(() => {
			const currentShell = getShellState();
			const currentBeacon = getBeaconState();
			const currentAnchor = getAnchorState();
			const currentFeedback = getFeedbackState();
			const noNewerEffect =
				currentFeedback.effect == null ||
				currentFeedback.effect.token === effectToken;

			if (
				noNewerEffect &&
				currentShell.mode === "icon" &&
				currentBeacon.reveal === "peek" &&
				!currentAnchor.isAnchorDragging
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
