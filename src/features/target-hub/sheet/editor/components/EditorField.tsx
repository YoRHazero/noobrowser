import { Box, HStack, Text, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../../recipes/sheet.recipe";

interface EditorFieldProps {
	label: string;
	children: React.ReactNode;
	flex?: string;
}

export function EditorField({ label, children, flex = "1" }: EditorFieldProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.inlineField} flex={flex}>
			<Text css={styles.inlineFieldLabel}>{label}</Text>
			<Box minW={0} w="full">
				{children}
			</Box>
		</HStack>
	);
}
