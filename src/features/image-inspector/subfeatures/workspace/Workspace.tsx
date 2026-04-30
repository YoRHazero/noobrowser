"use client";

import { Box, Presence, useSlotRecipe } from "@chakra-ui/react";
import { DarkMode } from "@/components/ui/color-mode";
import type { WorkspaceSection } from "../../shared/types";
import { WorkspaceDock } from "./parts/WorkspaceDock";
import { WorkspacePanel } from "./parts/WorkspacePanel";
import AnnotationLayer from "./subfeatures/annotation-layer";
import BaseLayer from "./subfeatures/base-layer";
import MaskLayer from "./subfeatures/mask-layer";
import ReferenceLayer from "./subfeatures/reference-layer";
import Settings from "./subfeatures/settings";
import { useWorkspace } from "./useWorkspace";
import { workspaceRecipe } from "./Workspace.recipe";

function renderSection(section: WorkspaceSection) {
	switch (section) {
		case "baseLayer":
			return <BaseLayer />;
		case "referenceLayer":
			return <ReferenceLayer />;
		case "maskLayer":
			return <MaskLayer />;
		case "annotationLayer":
			return <AnnotationLayer />;
		case "settings":
			return <Settings />;
	}
}

export function Workspace() {
	const recipe = useSlotRecipe({ recipe: workspaceRecipe });
	const styles = recipe();
	const workspace = useWorkspace();

	return (
		<Box css={styles.anchor}>
			<DarkMode>
				<Presence
					present={!workspace.open}
					unmountOnExit
					animationStyle={{
						_open: "scale-fade-in",
						_closed: "scale-fade-out",
					}}
					animationDuration="140ms"
				>
					<WorkspaceDock
						activeSection={workspace.activeSection}
						onSectionClick={workspace.onSectionToggle}
					/>
				</Presence>

				<Presence
					present={workspace.open}
					unmountOnExit
					position="absolute"
					top="0"
					left="0"
					animationStyle={{
						_open: "scale-fade-in",
						_closed: "scale-fade-out",
					}}
					animationDuration="180ms"
					animationTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
				>
					<WorkspacePanel
						activeSection={workspace.activeSection}
						onSectionClick={workspace.onSectionToggle}
						onClose={workspace.onClose}
					>
						{renderSection(workspace.activeSection)}
					</WorkspacePanel>
				</Presence>
			</DarkMode>
		</Box>
	);
}
