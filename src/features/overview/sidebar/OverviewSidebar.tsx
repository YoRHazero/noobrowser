import { Box, Tabs, useSlotRecipe } from "@chakra-ui/react";
import { FootprintsSection } from "./FootprintsSection";
import { TargetsSection } from "./TargetsSection";
import { overviewSidebarShellRecipe } from "./recipes/overview-sidebar-shell.recipe";

export function OverviewSidebar() {
	const recipe = useSlotRecipe({ recipe: overviewSidebarShellRecipe });
	const styles = recipe();

	return (
		<Box as="aside" css={styles.root}>
			<Tabs.Root
				defaultValue="footprints"
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
