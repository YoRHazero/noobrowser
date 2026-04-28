import {
	Box,
	HStack,
	IconButton,
	Stack,
	Tabs,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { SPECTRUM_WORKSPACE_HUD_TAB_OPTIONS } from "../../shared/constants";
import { hudPanelRecipe } from "./HudPanel.recipe";

export interface HudPanelProps {
	activeTab: "display" | "extraction";
	onTabChange: (value: "display" | "extraction") => void;
	onClose: () => void;
	displayTab: ReactNode;
	extractionTab: ReactNode;
}

export function HudPanel({
	activeTab,
	onTabChange,
	onClose,
	displayTab,
	extractionTab,
}: HudPanelProps) {
	const recipe = useSlotRecipe({ recipe: hudPanelRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<HStack css={styles.header}>
				<Stack gap={0} css={styles.titleGroup}>
					<Text css={styles.eyebrow}>Spectrum HUD</Text>
					<Text css={styles.title}>2D Workbench</Text>
				</Stack>

				<IconButton
					aria-label="Close 2D spectrum controls"
					variant="plain"
					css={styles.closeButton}
					onClick={onClose}
				>
					<FiX />
				</IconButton>
			</HStack>

			<Tabs.Root
				value={activeTab}
				onValueChange={({ value }) => {
					if (value === "display" || value === "extraction") {
						onTabChange(value);
					}
				}}
			>
				<Tabs.List css={styles.tabsList}>
					{SPECTRUM_WORKSPACE_HUD_TAB_OPTIONS.map((tab) => (
						<Tabs.Trigger
							key={tab.value}
							value={tab.value}
							css={styles.tabsTrigger}
						>
							{tab.label}
						</Tabs.Trigger>
					))}
				</Tabs.List>

				<Tabs.Content value="display" css={styles.tabContent}>
					{displayTab}
				</Tabs.Content>
				<Tabs.Content value="extraction" css={styles.tabContent}>
					{extractionTab}
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
}
