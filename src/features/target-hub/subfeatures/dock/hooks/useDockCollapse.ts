"use client";

import { useEffect, useRef, useState } from "react";
import { DOCK_EXIT_DURATION_MS } from "../../../shared/constants";
import { useShellStore } from "../../../store/useShellStore";

export function useDockCollapse() {
	const collapseToIcon = useShellStore((state) => state.collapseToIcon);
	const timeoutRef = useRef<number | null>(null);
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const onCollapse = () => {
		setIsClosing(true);
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = window.setTimeout(() => {
			timeoutRef.current = null;
			collapseToIcon();
		}, DOCK_EXIT_DURATION_MS);
	};

	return {
		isClosing,
		onCollapse,
	};
}
