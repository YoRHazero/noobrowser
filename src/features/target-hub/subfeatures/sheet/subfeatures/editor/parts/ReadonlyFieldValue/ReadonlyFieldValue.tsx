import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { EDITOR_EMPTY_VALUE } from "../../shared/constants";
import { readonlyFieldValueRecipe } from "./ReadonlyFieldValue.recipe";

interface ReadonlyFieldValueProps {
	value: string;
	tone?: "default" | "muted";
}

export function ReadonlyFieldValue({
	value,
	tone = "default",
}: ReadonlyFieldValueProps) {
	const recipe = useSlotRecipe({ recipe: readonlyFieldValueRecipe });
	const styles = recipe({ tone });
	const shouldShowTooltip =
		value !== EDITOR_EMPTY_VALUE && value.trim().length > 0;

	const content = (
		<Box css={styles.readonlyField}>
			<Text css={styles.readonlyValue}>{value}</Text>
		</Box>
	);

	if (!shouldShowTooltip) {
		return content;
	}

	return (
		<Tooltip content={value} showArrow>
			{content}
		</Tooltip>
	);
}
