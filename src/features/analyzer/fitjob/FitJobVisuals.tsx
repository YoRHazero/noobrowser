import { Tabs, useSlotRecipe } from "@chakra-ui/react";
import { useFitJobVisuals } from "./hooks/useFitJobVisuals";
import { ResultImage } from "./components/ResultImage";
import { fitJobVisualsRecipe } from "./recipes/fit-job-visuals.recipe";

type FitJobVisualsProps = {
	jobId: string;
	selectedModelName: string | null;
	isCompleted: boolean;
	bestModelName?: string | null;
};

export default function FitJobVisuals(props: FitJobVisualsProps) {
	const { plots } = useFitJobVisuals(props);
	const recipe = useSlotRecipe({ recipe: fitJobVisualsRecipe });
	const styles = recipe();

	// We'll use the first plot (comparison) as default unless logic dictates otherwise
	// But Tabs needs to know which one is active.
	// Actually, Tabs manages its own state by default.

	if (!props.isCompleted) return null;

	return (
		<Tabs.Root defaultValue="comparison" fitted css={styles.root}>
			<Tabs.List css={styles.tabList}>
				{plots.map((plot) => (
					<Tabs.Trigger
						key={plot.kind}
						value={plot.kind}
						css={styles.tabTrigger}
					>
						{plot.title}
					</Tabs.Trigger>
				))}
			</Tabs.List>

			{plots.map((plot) => (
				<Tabs.Content key={plot.kind} value={plot.kind} css={styles.tabContent}>
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
