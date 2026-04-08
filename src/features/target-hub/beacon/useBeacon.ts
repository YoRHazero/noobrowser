"use client";

import type { MouseEventHandler, PointerEventHandler } from "react";
import type { BeaconEffect, BeaconRevealState } from "../shared/types";
import { useFeedbackStore } from "../store/useFeedbackStore";
import { useBeaconAttentionFromEffect } from "./hooks/useBeaconAttentionFromEffect";
import { useBeaconDrag } from "./hooks/useBeaconDrag";
import { useBeaconProximity } from "./hooks/useBeaconProximity";
import { useBeaconStore } from "./store/useBeaconStore";

export interface BeaconViewModel {
	reveal: BeaconRevealState;
	isDragging: boolean;
	effect: BeaconEffect | null;
	top: number;
	onPointerDown: PointerEventHandler<HTMLDivElement>;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export function useBeacon(): BeaconViewModel {
	useBeaconAttentionFromEffect();
	useBeaconProximity();

	const reveal = useBeaconStore((state) => state.reveal);
	const isDragging = useBeaconStore((state) => state.isDragging);
	const effect = useFeedbackStore((state) => state.effect);
	const { top, handlePointerDown, handleClick } = useBeaconDrag();

	return {
		reveal,
		isDragging,
		effect,
		top,
		onPointerDown: handlePointerDown,
		onClick: handleClick,
	};
}
