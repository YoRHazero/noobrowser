import { Box, Stack, useSlotRecipe } from "@chakra-ui/react";
import { shellRecipe } from "./Shell.recipe";

interface ShellProps {
	children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
	const recipe = useSlotRecipe({ recipe: shellRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<Stack css={styles.shell}>{children}</Stack>
		</Box>
	);
}
