import { useState } from "react";
import { useOverviewSelectionValidity } from "./hooks/useOverviewSelectionValidity";

export interface UseOverviewResult {
	isViewerHudOpen: boolean;
	setIsViewerHudOpen: (open: boolean) => void;
}

export function useOverview(): UseOverviewResult {
	const [isViewerHudOpen, setIsViewerHudOpen] = useState(false);
	useOverviewSelectionValidity();

	return {
		isViewerHudOpen,
		setIsViewerHudOpen,
	};
}
