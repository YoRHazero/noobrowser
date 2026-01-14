import { Box, ScrollArea, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { LuList } from "react-icons/lu";
import { SectionHeader } from "./components/SectionHeader";
import { EmissionLineAdder } from "./EmissionLineAdder";
import { EmissionLineCard } from "./EmissionLineCard";
import { useEmissionLinesManager } from "./hooks/useEmissionLinesManager";
import { emissionLinesRecipe } from "./recipes/emission-lines.recipe";

export default function EmissionLinesManager() {
	const { sortedLineKeys } = useEmissionLinesManager();

	const recipe = useSlotRecipe({ recipe: emissionLinesRecipe });
	const styles = recipe();

	return (
		<Stack gap={3} h="full" minH={0}>
			<Box px={4}>
				<SectionHeader
					title="Emission Lines"
					tip="Add and select emission lines to display on the spectrum."
					rightSlot={<EmissionLineAdder />}
				/>
			</Box>

			<ScrollArea.Root flex="1" minH="0">
				<ScrollArea.Viewport>
					<ScrollArea.Content p={2} pb={8}>
						{sortedLineKeys.length === 0 ? (
							<Stack css={styles.emptyState}>
								<LuList size={24} style={{ opacity: 0.3 }} />
								<Text css={styles.emptyText}>NO DATA FOUND</Text>
							</Stack>
						) : (
							<Stack gap={2}>
								{sortedLineKeys.map((emissionName) => (
									<EmissionLineCard
										key={emissionName}
										emissionName={emissionName}
									/>
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
