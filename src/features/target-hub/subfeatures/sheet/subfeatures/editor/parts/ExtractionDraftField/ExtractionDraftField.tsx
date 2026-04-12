import { NumberInput, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { extractionDraftFieldRecipe } from "./ExtractionDraftField.recipe";

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
	const recipe = useSlotRecipe({ recipe: extractionDraftFieldRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.fieldRoot}>
			<Text css={styles.label}>{label}</Text>
			<NumberInput.Root
				css={styles.editableFieldRoot}
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
