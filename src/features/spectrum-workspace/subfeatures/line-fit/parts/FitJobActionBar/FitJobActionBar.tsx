import { Box, Button, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { Send } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitJobActionBarModel } from "../../hooks/lineFitModels";
import { fitJobActionBarRecipe } from "./FitJobActionBar.recipe";

export function FitJobActionBar({
	statusLabel,
	detailLabel,
	canSubmit,
	isSubmitting,
	tooltip,
	onSubmit,
}: FitJobActionBarModel) {
	const recipe = useSlotRecipe({ recipe: fitJobActionBarRecipe });
	const styles = recipe({ ready: canSubmit });

	return (
		<Box css={styles.root}>
			<Box css={styles.meta}>
				<Text css={styles.badge}>MCMC</Text>
				<Stack gap={0} minW={0}>
					<Text css={styles.statusText}>{statusLabel}</Text>
					<Text css={styles.detailText}>{detailLabel}</Text>
				</Stack>
			</Box>

			<Tooltip content={tooltip}>
				<Box css={styles.submitWrap}>
					<Button
						size="xs"
						colorPalette="cyan"
						variant="outline"
						css={styles.submitButton}
						disabled={!canSubmit || isSubmitting}
						loading={isSubmitting}
						onClick={onSubmit}
					>
						<Send size={13} />
						Submit
					</Button>
				</Box>
			</Tooltip>
		</Box>
	);
}
