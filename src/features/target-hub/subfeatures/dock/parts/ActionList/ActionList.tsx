import { Stack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { dockActionListRecipe } from "./ActionList.recipe";

interface ActionListProps {
	children: ReactNode;
}

export function ActionList({ children }: ActionListProps) {
	const recipe = useSlotRecipe({ recipe: dockActionListRecipe });
	const styles = recipe();

	return <Stack css={styles.root}>{children}</Stack>;
}
