import { Box, Tabs } from "@chakra-ui/react";
import type { PlotState } from "../types";
import { ResultImage } from "./ResultImage";

interface FitJobPlotsTabsProps {
	plots: PlotState[];
}

export function FitJobPlotsTabs({ plots }: FitJobPlotsTabsProps) {
	if (plots.length === 0) return null;

	const defaultValue = plots[0]?.kind ?? "comparison";

	return (
		<Tabs.Root defaultValue={defaultValue} variant="enclosed" fitted>
			<Tabs.List>
				{plots.map((plot) => (
					<Tabs.Trigger key={plot.kind} value={plot.kind}>
						{plot.title}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			<Box mt={4}>
				{plots.map((plot) => (
					<Tabs.Content key={plot.kind} value={plot.kind}>
						<ResultImage
							title={plot.title}
							src={plot.url}
							isLoading={plot.isLoading}
							error={plot.error}
						/>
					</Tabs.Content>
				))}
			</Box>
		</Tabs.Root>
	);
}
