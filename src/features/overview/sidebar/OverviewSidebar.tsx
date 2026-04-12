import { Box, Tabs, useSlotRecipe } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import type { OverviewSidebarTab } from "../store";
import { useOverviewStore } from "../store";
import { FootprintsSection } from "./FootprintsSection";
import { overviewSidebarShellRecipe } from "./recipes/overview-sidebar-shell.recipe";
import { TargetsSection } from "./TargetsSection";

export function OverviewSidebar() {
	const recipe = useSlotRecipe({ recipe: overviewSidebarShellRecipe });
	const styles = recipe();
	const { activeSidebarTab, setActiveSidebarTab } = useOverviewStore(
		useShallow((state) => ({
			activeSidebarTab: state.activeSidebarTab,
			setActiveSidebarTab: state.setActiveSidebarTab,
		})),
	);

	return (
		<Box as="aside" css={styles.root}>
			<Tabs.Root
				value={activeSidebarTab}
				onValueChange={(details) =>
					setActiveSidebarTab(details.value as OverviewSidebarTab)
				}
				variant="line"
				fitted
				colorPalette="cyan"
				css={styles.tabsRoot}
			>
				<Tabs.List css={styles.tabsList}>
					<Tabs.Trigger value="footprints" css={styles.tabTrigger}>
						Footprints
					</Tabs.Trigger>
					<Tabs.Trigger value="targets" css={styles.tabTrigger}>
						Targets
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="footprints" h="100%">
					<FootprintsSection />
				</Tabs.Content>
				<Tabs.Content value="targets" h="100%">
					<TargetsSection />
				</Tabs.Content>
			</Tabs.Root>
		</Box>
	);
}
