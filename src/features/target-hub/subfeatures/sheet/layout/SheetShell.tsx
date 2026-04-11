import { Box, Stack, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../recipes/sheet.recipe";

interface SheetShellProps {
	children: React.ReactNode;
}

export function SheetShell({ children }: SheetShellProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Stack css={styles.shell}>{children}</Stack>
		</Box>
	);
}
