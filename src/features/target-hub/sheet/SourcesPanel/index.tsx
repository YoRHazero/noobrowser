"use client";

import { SourcesPanelView } from "./SourcesPanelView";
import { useSourcesPanel } from "./useSourcesPanel";

export default function SourcesPanel() {
	const viewModel = useSourcesPanel();

	return <SourcesPanelView {...viewModel} />;
}
