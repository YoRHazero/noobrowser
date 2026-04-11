import { Box, Stack, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties, PointerEventHandler, ReactNode } from "react";
import { TARGET_HUB_Z_INDEX } from "../../../../shared/constants";
import { dockShellRecipe } from "./Shell.recipe";

interface ShellProps {
	top: number;
	isAnchorDragging: boolean;
	isClosing: boolean;
	onHandlePointerDown: PointerEventHandler<HTMLDivElement>;
	children: ReactNode;
}

export function Shell({
	top,
	isAnchorDragging,
	isClosing,
	onHandlePointerDown,
	children,
}: ShellProps) {
	const recipe = useSlotRecipe({ recipe: dockShellRecipe });
	const styles = recipe({ isAnchorDragging, isClosing });

	return (
		<Box
			css={styles.root}
			style={
				{
					top: `${top}px`,
					"--target-hub-z-index": TARGET_HUB_Z_INDEX,
				} as CSSProperties
			}
		>
			<Stack css={styles.shell}>
				<Box css={styles.handle} onPointerDown={onHandlePointerDown}>
					<Box css={styles.handleBar} />
				</Box>
				{children}
			</Stack>
		</Box>
	);
}
