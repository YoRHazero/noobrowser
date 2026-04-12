import { Box, type BoxProps, useSlotRecipe } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { mapCanvasRecipe } from "../MapCanvas.recipe";
import type { TooltipPosition } from "../shared/types";

export interface TooltipShellProps
	extends PropsWithChildren,
		Omit<BoxProps, "left" | "top" | "position"> {
	anchorPosition: TooltipPosition;
}

export function TooltipShell({
	anchorPosition,
	children,
	...boxProps
}: TooltipShellProps) {
	const recipe = useSlotRecipe({ recipe: mapCanvasRecipe });
	const styles = recipe();

	return (
		<Box
			css={styles.tooltip}
			left={`${anchorPosition.left}px`}
			top={`${anchorPosition.top}px`}
			{...boxProps}
		>
			{children}
		</Box>
	);
}
