import {
	Badge,
	Box,
	ScrollArea,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { LuTarget } from "react-icons/lu";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useTargetSourceList } from "./hooks/useTargetSourceList";
import { targetSourceListRecipe } from "./recipes/target-source-list.recipe";
import SourceItem from "./SourceItem";

export default function TargetSourceList() {
	const { readySources } = useTargetSourceList();
	const recipe = useSlotRecipe({ recipe: targetSourceListRecipe });
	const styles = recipe();
	return (
		<Stack css={styles.root}>
			<Box px={4} pt={4} pb={2}>
				<SectionHeader
					title="Target Sources"
					tip="List of sources detected in the field ready for extraction."
					rightSlot={
						<Badge colorPalette="cyan" variant="solid" size="xs">
							{readySources.length} READY
						</Badge>
					}
				/>
			</Box>

			<ScrollArea.Root flex="1" minH="0">
				<ScrollArea.Viewport>
					<ScrollArea.Content css={styles.content}>
						{readySources.length === 0 ? (
							<Stack css={styles.emptyState}>
								<LuTarget size={28} style={{ opacity: 0.3 }} />
								<Text css={styles.emptyTitle}>NO SOURCES READY</Text>
								<Text css={styles.emptySubtitle}>
									Extract sources in "Trace" panel first
								</Text>
							</Stack>
						) : (
							<Stack gap={2}>
								{readySources.map((source) => (
									<SourceItem key={source.id} source={source} />
								))}
							</Stack>
						)}
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar>
					<ScrollArea.Thumb />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
		</Stack>
	);
}
