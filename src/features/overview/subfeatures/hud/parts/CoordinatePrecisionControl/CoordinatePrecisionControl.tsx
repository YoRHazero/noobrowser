import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { coordinatePrecisionControlRecipe } from "./CoordinatePrecisionControl.recipe";

export interface CoordinatePrecisionControlProps {
	precision: number;
	disabled: boolean;
	onPrecisionChange: (precision: number) => void;
}

export function CoordinatePrecisionControl({
	precision,
	disabled,
	onPrecisionChange,
}: CoordinatePrecisionControlProps) {
	const recipe = useSlotRecipe({
		recipe: coordinatePrecisionControlRecipe,
	});
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Text css={styles.label}>Coordinate Precision</Text>
			<Box css={styles.fieldRow}>
				<CompactNumberInput
					label="Digits"
					value={precision}
					onChange={onPrecisionChange}
					step={1}
					min={0}
					max={100}
					decimalScale={0}
					inputWidth="88px"
					labelWidth="auto"
					disabled={disabled}
				/>
			</Box>
		</Box>
	);
}
