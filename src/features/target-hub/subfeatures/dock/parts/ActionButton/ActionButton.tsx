import { Button, HStack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { dockActionButtonRecipe } from "./ActionButton.recipe";

interface ActionButtonProps {
	label: string;
	icon: ReactNode;
	onClick?: () => void;
	tone?: "default" | "accent";
	isDisabled?: boolean;
}

export function ActionButton({
	label,
	icon,
	onClick,
	tone = "default",
	isDisabled = false,
}: ActionButtonProps) {
	const recipe = useSlotRecipe({ recipe: dockActionButtonRecipe });
	const styles = recipe({ tone });

	return (
		<Button
			css={styles.button}
			onClick={isDisabled ? undefined : onClick}
			aria-disabled={isDisabled || undefined}
		>
			<HStack css={styles.content}>
				{icon}
				<span>{label}</span>
			</HStack>
		</Button>
	);
}
