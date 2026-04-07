import { Box, Stack, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../recipes/sheet.recipe";

interface TargetHubSheetShellProps {
	children: React.ReactNode;
}

export function TargetHubSheetShell({ children }: TargetHubSheetShellProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Stack css={styles.shell}>{children}</Stack>
		</Box>
	);
}
