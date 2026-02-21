import {
	Badge,
	Box,
	HStack,
	Separator,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Star } from "lucide-react";
import type { FitJobSummary } from "../types";
import { summaryPanelRecipe } from "../recipes/summary-panel.recipe";
import { StatBadge } from "./StatBadge";
import { ComponentItem } from "./ComponentItem";




type SummaryPanelProps = {
	summary: FitJobSummary;
	selectedModelName: string | null;
	onSelectModelName: (name: string) => void;
};

export function SummaryPanel({
	summary,
	selectedModelName,
	onSelectModelName,
}: SummaryPanelProps) {
	const recipe = useSlotRecipe({ recipe: summaryPanelRecipe });
	const styles = recipe();

	const activeResult =
		summary.results.find((r) => r.model_name === selectedModelName) ||
		summary.results[0];

	if (!activeResult) return null;

	// Use is_best from the result itself if available, or fallback to name comparison
	const isBest =
		activeResult.is_best ??
		summary.best_model_name === activeResult.model_name;

	return (
		<Box css={styles.root}>
			{/* Header with Model Selector */}
			<Box css={styles.header}>
				<HStack gap={2}>
					<Text
						fontWeight="bold"
						color={isBest ? "green.500" : "cyan.600"}
						_dark={{ color: isBest ? "green.300" : "cyan.300" }}
					>
						{activeResult.model_name}
					</Text>
					{isBest && (
						<Badge colorPalette="green" variant="solid" size="xs">
							<Star
								size={10}
								fill="currentColor"
								style={{ marginRight: 4 }}
							/>{" "}
							BEST FIT
						</Badge>
					)}
				</HStack>

				{summary.results.length > 1 && (
					<HStack gap={1} wrap="wrap">
						{summary.results.map((r) => (
							<Badge
								key={r.model_name}
								variant={
									selectedModelName === r.model_name
										? "solid"
										: "outline"
								}
								colorPalette={
									selectedModelName === r.model_name
										? "cyan"
										: "gray"
								}
								cursor="pointer"
								onClick={() => onSelectModelName(r.model_name)}
								_hover={{ opacity: 0.8 }}
							>
								{r.is_best && (
									<Star
										size={8}
										style={{
											marginRight: 2,
											display: "inline",
										}}
									/>
								)}
								{r.model_name}
							</Badge>
						))}
					</HStack>
				)}
			</Box>



			{/* Stats */}
			<Box css={styles.statsRow}>
				<StatBadge
					label="WAIC"
					value={`${activeResult.waic.toFixed(1)} ± ${activeResult.waic_se.toFixed(1)}`}
					color="purple"
				/>
			</Box>

			<Separator borderColor="border.subtle" mb={3} />

			{/* Components List */}
			<Box css={styles.componentList}>
				<Text css={styles.sectionTitle}>
					COMPONENTS
				</Text>
				{activeResult.components.map((comp, idx) => (
					<ComponentItem
						key={`${comp.name}-${idx}`}
						comp={comp}
						styles={styles}
					/>
				))}
			</Box>
		</Box>
	);
}

