"use client";

import type { MouseEventHandler, PointerEventHandler } from "react";
import type { BeaconEffect, BeaconRevealState } from "../../shared/types";
import { useAnchorStore } from "../../store/useAnchorStore";
import { useFeedbackStore } from "../../store/useFeedbackStore";
import { useBeaconAttentionFromEffect } from "./hooks/useBeaconAttentionFromEffect";
import { useBeaconDrag } from "./hooks/useBeaconDrag";
import { useBeaconProximity } from "./hooks/useBeaconProximity";
import { useBeaconStore } from "./store/useBeaconStore";

export interface BeaconViewModel {
	reveal: BeaconRevealState;
	isAnchorDragging: boolean;
	effect: BeaconEffect | null;
	top: number;
	onPointerDown: PointerEventHandler<HTMLDivElement>;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export function useBeacon(): BeaconViewModel {
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
