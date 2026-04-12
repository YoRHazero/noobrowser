import { Box, HStack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { editorFieldRecipe } from "./EditorField.recipe";

interface EditorFieldProps {
	label: string;
	children: ReactNode;
	flex?: string;
}

export function EditorField({ label, children, flex = "1" }: EditorFieldProps) {
	const recipe = useSlotRecipe({ recipe: editorFieldRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.inlineField} flex={flex}>
			<Text css={styles.inlineFieldLabel}>{label}</Text>
			<Box css={styles.fieldContent}>{children}</Box>
		</HStack>
	);
}
