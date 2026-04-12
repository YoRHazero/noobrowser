"use client";

import { Tabs, useSlotRecipe } from "@chakra-ui/react";
import type { FitJobPlotState } from "../../shared/types";
import ResultImage from "../ResultImage";
import { jobVisualTabsRecipe } from "./JobVisualTabs.recipe";

type JobVisualTabsProps = {
	plots: FitJobPlotState[];
};

export default function JobVisualTabs({ plots }: JobVisualTabsProps) {
	const recipe = useSlotRecipe({ recipe: jobVisualTabsRecipe });
	const styles = recipe();

	if (plots.length === 0) {
		return null;
	}

	return (
		<Tabs.Root defaultValue={plots[0]?.kind ?? "comparison"} css={styles.root}>
			<Tabs.List css={styles.list}>
				{plots.map((plot) => (
					<Tabs.Trigger key={plot.kind} value={plot.kind} css={styles.trigger}>
						{plot.title}
					</Tabs.Trigger>
				))}
			</Tabs.List>

			{plots.map((plot) => (
				<Tabs.Content key={plot.kind} value={plot.kind} css={styles.content}>
					<ResultImage
						title={plot.title}
						src={plot.url}
						isLoading={plot.isLoading}
						error={plot.error}
					/>
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
}
