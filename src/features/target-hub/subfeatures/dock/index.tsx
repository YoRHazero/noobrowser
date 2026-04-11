"use client";

import { DockView } from "./DockView";
import { useDock } from "./useDock";

export default function Dock() {
	const viewModel = useDock();

	return <DockView {...viewModel} />;
}
