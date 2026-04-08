import { useEffect, useRef } from "react";
import {
	BEACON_HIDE_DELAY_MS,
	BEACON_PEEK_DISTANCE,
	BEACON_REVEAL_DISTANCE,
} from "../../shared/constants";
import { useShellStore } from "../../store/useShellStore";
import { useBeaconStore } from "../store/useBeaconStore";

export function useBeaconProximity() {
	const mode = useShellStore((state) => state.mode);
	const isDragging = useBeaconStore((state) => state.isDragging);
	const reveal = useBeaconStore((state) => state.reveal);
	const setReveal = useBeaconStore((state) => state.setReveal);
	const hideTimerRef = useRef<number | null>(null);

	useEffect(() => {
		if (mode !== "icon" || isDragging) return undefined;

		const clearHideTimer = () => {
			if (hideTimerRef.current !== null) {
				window.clearTimeout(hideTimerRef.current);
				hideTimerRef.current = null;
			}
		};

		const scheduleHidden = () => {
			clearHideTimer();
			hideTimerRef.current = window.setTimeout(() => {
				setReveal("hidden");
			}, BEACON_HIDE_DELAY_MS);
		};

		const handlePointerMove = (event: PointerEvent) => {
			const nextX = event.clientX;
			if (nextX <= BEACON_REVEAL_DISTANCE) {
				clearHideTimer();
				if (reveal !== "reveal") setReveal("reveal");
				return;
			}
			if (nextX <= BEACON_PEEK_DISTANCE) {
				clearHideTimer();
				if (reveal !== "peek") setReveal("peek");
				return;
			}
			scheduleHidden();
		};

		window.addEventListener("pointermove", handlePointerMove);
		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			clearHideTimer();
		};
	}, [isDragging, mode, reveal, setReveal]);
}
