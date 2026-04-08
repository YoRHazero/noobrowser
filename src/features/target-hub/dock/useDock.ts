"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourceStore } from "@/stores/source";
import { DOCK_EXIT_DURATION_MS } from "../shared/constants";
import { useShellStore } from "../store/useShellStore";
import { useDockAnchor } from "./hooks/useDockAnchor";
import { getDockSourceCardViewModel } from "./utils";

export function useDock() {
	const { collapseToIcon, openSheet } = useShellStore(
		useShallow((state) => ({
			collapseToIcon: state.collapseToIcon,
			openSheet: state.openSheet,
		})),
	);
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);
	const top = useDockAnchor();
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		setIsClosing(false);
	}, []);

	const activeSource =
		sources.find((source) => source.id === activeSourceId) ?? null;
	const sourceCard = getDockSourceCardViewModel(activeSource);

	return {
		top,
		isClosing,
		sourceCard,
		onOpenSheet: openSheet,
		onCollapse: () => {
			setIsClosing(true);
			window.setTimeout(() => {
				collapseToIcon();
			}, DOCK_EXIT_DURATION_MS);
		},
	};
}
