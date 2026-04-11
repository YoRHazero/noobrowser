"use client";

import { useAnchorStore } from "../../store/useAnchorStore";
import { useFeedbackStore } from "../../store/useFeedbackStore";
import { useBeaconAttentionFromEffect } from "./hooks/useBeaconAttentionFromEffect";
import { useBeaconDrag } from "./hooks/useBeaconDrag";
import { useBeaconProximity } from "./hooks/useBeaconProximity";
import { useBeaconStore } from "./store/useBeaconStore";

export function useBeacon() {
	useBeaconAttentionFromEffect();
	useBeaconProximity();

	const reveal = useBeaconStore((state) => state.reveal);
	const isAnchorDragging = useAnchorStore((state) => state.isAnchorDragging);
	const effect = useFeedbackStore((state) => state.effect);
	const { top, handlePointerDown, handleClick } = useBeaconDrag();

	return {
		reveal,
		isAnchorDragging,
		effect,
		top,
		onPointerDown: handlePointerDown,
		onClick: handleClick,
	};
}
