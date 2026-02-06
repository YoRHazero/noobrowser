import { Box, Tabs, Text } from "@chakra-ui/react";
import type { PlotState } from "../types";
import { ResultImage } from "./ResultImage";

interface FitJobPlotsTabsProps {
	plots: PlotState[];
	selectedModelName?: string | null;
}

export function FitJobPlotsTabs({
	plots,
	selectedModelName,
}: FitJobPlotsTabsProps) {
	if (plots.length === 0) return null;

	const defaultValue = plots[0]?.kind ?? "comparison";

	return (
		<Box>
			<Text fontSize="xs" color="gray.400" mb={2}>
				Plotting model:{" "}
				<Text as="span" color="cyan.200" fontFamily="mono">
					{selectedModelName ?? "Best"}
				</Text>
			</Text>
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
		</Box>
	);
}
