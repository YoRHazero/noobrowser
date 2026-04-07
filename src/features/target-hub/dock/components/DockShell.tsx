import { Box, Stack, useSlotRecipe } from "@chakra-ui/react";
import { TARGET_HUB_Z_INDEX } from "../../shared/constants";
import { getDockAnimation } from "../animations/dock.animations";
import { dockShellRecipe } from "../recipes/dockShell.recipe";

interface DockShellProps {
	top: number;
	isClosing: boolean;
	children: React.ReactNode;
}

export function DockShell({ top, isClosing, children }: DockShellProps) {
	const recipe = useSlotRecipe({ recipe: dockShellRecipe });
	const styles = recipe();

	return (
		<Box
			css={{
				...styles.root,
				top: `${top}px`,
				animation: getDockAnimation(isClosing ? "exit" : "enter"),
				pointerEvents: isClosing ? "none" : "auto",
				"--target-hub-z-index": TARGET_HUB_Z_INDEX,
			}}
		>
			<Stack css={styles.shell} gap={0}>
				{children}
			</Stack>
		</Box>
	);
}
