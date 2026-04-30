"use client";

import {
	Box,
	HStack,
	IconButton,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import {
	Blend,
	Image,
	Layers,
	type LucideIcon,
	PenLine,
	Settings,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS } from "../../../../shared/constants";
import type { WorkspaceSection } from "../../../../shared/types";
import { workspacePanelRecipe } from "./WorkspacePanel.recipe";

const WORKSPACE_PANEL_ICONS = {
	baseLayer: Image,
	referenceLayer: Blend,
	maskLayer: Layers,
	annotationLayer: PenLine,
	settings: Settings,
} satisfies Record<WorkspaceSection, LucideIcon>;

export interface WorkspacePanelProps {
	activeSection: WorkspaceSection;
	onSectionClick: (section: WorkspaceSection) => void;
	onClose: () => void;
	children: ReactNode;
}

export function WorkspacePanel({
	activeSection,
	onSectionClick,
	onClose,
	children,
}: WorkspacePanelProps) {
	const recipe = useSlotRecipe({ recipe: workspacePanelRecipe });
	const rootStyles = recipe();
	const activeOption =
		IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS.find(
			(section) => section.value === activeSection,
		) ?? IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS[0];

	return (
		<Box css={rootStyles.root}>
			<HStack css={rootStyles.header}>
				<Stack css={rootStyles.titleGroup}>
					<Text css={rootStyles.eyebrow}>Image Inspector</Text>
					<Text css={rootStyles.title}>{activeOption.label}</Text>
				</Stack>

				<Tooltip content="Close workspace" showArrow>
					<IconButton
						aria-label="Close image inspector workspace"
						variant="plain"
						css={rootStyles.closeButton}
						onClick={onClose}
					>
						<X />
					</IconButton>
				</Tooltip>
			</HStack>

			<Box css={rootStyles.body}>
				<Box as="nav" css={rootStyles.rail} aria-label="Workspace sections">
					{IMAGE_INSPECTOR_WORKSPACE_SECTION_OPTIONS.map((section) => {
						const Icon = WORKSPACE_PANEL_ICONS[section.value];
						const styles = recipe({ active: activeSection === section.value });

						return (
							<Tooltip key={section.value} content={section.label} showArrow>
								<IconButton
									variant="plain"
									css={styles.railButton}
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

				<Box css={rootStyles.content}>{children}</Box>
			</Box>
		</Box>
	);
}
