"use client";

import {
	Badge,
	Box,
	HStack,
	Separator,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Star } from "lucide-react";
import type { FitJobSummary } from "../../shared/types";
import ComponentSummaryItem from "../ComponentSummaryItem";
import StatBadge from "../StatBadge";
import { summaryPanelRecipe } from "./SummaryPanel.recipe";

type SummaryPanelProps = {
	summary: FitJobSummary;
	selectedModelName: string | null;
	onSelectModelName: (modelName: string) => void;
};

export default function SummaryPanel({
	summary,
	selectedModelName,
	onSelectModelName,
}: SummaryPanelProps) {
	const recipe = useSlotRecipe({ recipe: summaryPanelRecipe });
	const styles = recipe();

	const activeResult =
		summary.results.find((result) => result.model_name === selectedModelName) ??
		summary.results.find(
			(result) => result.model_name === summary.best_model_name,
		) ??
		summary.results[0] ??
		null;

	if (!activeResult) {
		return (
			<Box css={styles.root}>
				<Text css={styles.emptyState}>No summary results available.</Text>
			</Box>
		);
	}

	return (
		<Box css={styles.root}>
			<Stack css={styles.header}>
				<HStack css={styles.titleRow}>
					<Text css={styles.title}>Summary</Text>
					{summary.best_model_name ? (
						<Badge css={styles.bestBadge} variant="subtle" size="sm">
							<Box as="span" css={styles.badgeIcon}>
								<Star size={10} />
							</Box>
							Best: {summary.best_model_name}
						</Badge>
					) : null}
				</HStack>

				{summary.results.length > 1 ? (
					<HStack css={styles.modelList}>
						{summary.results.map((result) => {
							const isActive = result.model_name === activeResult.model_name;
							return (
								<Badge
									key={result.model_name}
									css={styles.modelBadge}
									variant={isActive ? "solid" : "outline"}
									colorPalette={isActive ? "cyan" : "gray"}
									onClick={() => onSelectModelName(result.model_name)}
								>
									{result.is_best ? (
										<Box as="span" css={styles.badgeIcon}>
											<Star size={8} />
										</Box>
									) : null}
									{result.model_name}
								</Badge>
							);
						})}
					</HStack>
				) : null}
			</Stack>

			<HStack css={styles.statsRow}>
				<StatBadge
					label="WAIC"
					value={`${activeResult.waic.toFixed(1)} ± ${activeResult.waic_se.toFixed(1)}`}
					tone="accent"
				/>
				{summary.created_at ? (
					<StatBadge
						label="Created"
						value={summary.created_at}
						tone="default"
					/>
				) : null}
			</HStack>

			<Separator css={styles.separator} />

			<Stack css={styles.componentList}>
				<Text css={styles.sectionTitle}>Components</Text>
				{activeResult.components.map((component) => (
					<ComponentSummaryItem
						key={`${activeResult.model_name}-${component.name}`}
						component={component}
					/>
				))}
			</Stack>
		</Box>
	);
}
