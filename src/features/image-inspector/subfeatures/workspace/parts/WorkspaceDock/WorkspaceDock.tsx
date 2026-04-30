"use client";

import { Box, IconButton, useSlotRecipe } from "@chakra-ui/react";
import {
	Blend,
	Image,
	Layers,
	type LucideIcon,
	PenLine,
	Settings,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS } from "../../../../shared/constants";
import type { WorkspaceSection } from "../../../../shared/types";
import { workspaceDockRecipe } from "./WorkspaceDock.recipe";

const WORKSPACE_DOCK_ICONS = {
	baseLayer: Image,
	referenceLayer: Blend,
	maskLayer: Layers,
	annotationLayer: PenLine,
	settings: Settings,
} satisfies Record<WorkspaceSection, LucideIcon>;

export interface WorkspaceDockProps {
	activeSection: WorkspaceSection;
	onSectionClick: (section: WorkspaceSection) => void;
}

export function WorkspaceDock({
	activeSection,
	onSectionClick,
}: WorkspaceDockProps) {
	const recipe = useSlotRecipe({ recipe: workspaceDockRecipe });
	const rootStyles = recipe();

	return (
		<Box as="nav" css={rootStyles.root} aria-label="Image inspector workspace">
			{IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS.map((section) => {
				const Icon = WORKSPACE_DOCK_ICONS[section.value];
				const styles = recipe({ active: activeSection === section.value });

				return (
					<Tooltip key={section.value} content={section.label} showArrow>
						<IconButton
							variant="plain"
							css={styles.button}
							aria-label={section.ariaLabel}
							aria-current={
								activeSection === section.value ? "true" : undefined
							}
							onClick={() => onSectionClick(section.value)}
						>
							<Icon />
						</IconButton>
					</Tooltip>
				);
			})}
		</Box>
	);
}
