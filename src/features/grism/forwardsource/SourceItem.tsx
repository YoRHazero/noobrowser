import {
	Box,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Cpu } from "lucide-react";
import type { CSSProperties } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import type { TraceSource } from "@/stores/stores-types";
import { useSourceItem } from "./hooks/useSourceItem";
import { sourceItemRecipe } from "./recipes/source-item.recipe";

interface SourceItemProps {
	source: TraceSource;
}

export default function SourceItem({ source }: SourceItemProps) {
	const {
		isRunning,
		isSelected,
		canRun,
		runVariant,
		runPalette,
		tooltipContent,
		handleSelect,
		handleRun,
	} = useSourceItem(source);
	const recipe = useSlotRecipe({ recipe: sourceItemRecipe });
	const styles = recipe({
		selected: isSelected,
		runnable: canRun,
		running: isRunning,
	});

	return (
		<Flex
			css={styles.root}
			justify="space-between"
			align="center"
			onClick={handleSelect}
		>
			<HStack gap={3} minW={0}>
				<Box
					css={styles.indicator}
					style={
						{
							backgroundColor: source.color,
							"--source-color": source.color,
						} as CSSProperties
					}
				/>

				<Stack gap={0} minW={0}>
					<Text css={styles.idText} title={source.id}>
						{source.id.slice(0, 6).toUpperCase()}
					</Text>
					<Text css={styles.coordText}>
						X:{source.x.toFixed(1)} Y:{source.y.toFixed(1)}
					</Text>
				</Stack>
			</HStack>

			<HStack onClick={(event) => event.stopPropagation()} gap={1}>
				<Tooltip content={tooltipContent}>
					<IconButton
						aria-label="Run MCMC Fit"
						size="xs"
						variant={runVariant}
						colorPalette={runPalette}
						disabled={!canRun || isRunning}
						css={styles.runButton}
						onClick={handleRun}
					>
						<Cpu size={14} />
					</IconButton>
				</Tooltip>
			</HStack>
		</Flex>
	);
}
