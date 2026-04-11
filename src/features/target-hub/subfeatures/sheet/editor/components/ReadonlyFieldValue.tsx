import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { sheetRecipe } from "../../recipes/sheet.recipe";

interface ReadonlyFieldValueProps {
	value: string;
	color: string;
}

export function ReadonlyFieldValue({ value, color }: ReadonlyFieldValueProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();
	const shouldShowTooltip = value !== "—" && value.trim().length > 0;

	const content = (
		<Box css={styles.readonlyField} minW={0}>
			<Text
				color={color}
				w="full"
				minW={0}
				overflow="hidden"
				textOverflow="ellipsis"
				whiteSpace="nowrap"
			>
				{value}
			</Text>
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
