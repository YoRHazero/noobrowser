"use client";

import { DockPanelView } from "./DockPanelView";
import { useDockPanel } from "./useDockPanel";

export default function DockPanel() {
	const viewModel = useDockPanel();

	return <DockPanelView {...viewModel} />;
}
