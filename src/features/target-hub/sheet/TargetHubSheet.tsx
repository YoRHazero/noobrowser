"use client";

import { TargetHubJobsDrawerShell } from "./TargetHubJobsDrawerShell";
import { TargetHubSheetHeader } from "./TargetHubSheetHeader";
import SourceEditorPanel from "./SourceEditorPanel";
import SourcesPanel from "./SourcesPanel";
import { TargetHubSheetShell } from "./components/TargetHubSheetShell";

export default function TargetHubSheet() {
	return (
		<>
			<TargetHubSheetShell>
				<TargetHubSheetHeader />
				<SourceEditorPanel />
				<SourcesPanel />
			</TargetHubSheetShell>
			<TargetHubJobsDrawerShell />
		</>
	);
}
