import { NumberInput, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../../recipes/sheet.recipe";

interface ExtractionDraftFieldProps {
	label: string;
	value: string;
	step: number;
	min?: number;
	onChange: (value: string) => void;
}

export function ExtractionDraftField({
	label,
	value,
	step,
	min,
	onChange,
}: ExtractionDraftFieldProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Stack gap={1.5}>
			<Text
				fontSize="11px"
				fontWeight="medium"
				letterSpacing="normal"
				textTransform="none"
				color="whiteAlpha.720"
			>
				{label}
			</Text>
			<NumberInput.Root
				size="sm"
				value={value}
				step={step}
				min={min}
				onValueChange={({ value: nextValue }) => onChange(nextValue)}
			>
				<NumberInput.Input css={styles.editableField} />
			</NumberInput.Root>
		</Stack>
	);
}
