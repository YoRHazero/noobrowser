import { Button, HStack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { dockActionButtonRecipe } from "../recipes/dockActionButton.recipe";

interface DockActionButtonProps {
	label: string;
	icon: ReactNode;
	onClick?: () => void;
	tone?: "default" | "accent";
	isDisabled?: boolean;
}

export function DockActionButton({
	label,
	icon,
	onClick,
	tone = "default",
	isDisabled = false,
}: DockActionButtonProps) {
	const recipe = useSlotRecipe({ recipe: dockActionButtonRecipe });
	const styles = recipe();

	return (
		<Button
			variant="outline"
			size="sm"
			css={{
				...styles.button,
				...(tone === "accent"
					? {
							borderColor: "cyan.300",
							color: "white",
							bg: "rgba(34, 211, 238, 0.10)",
							_hover: {
								bg: "rgba(34, 211, 238, 0.18)",
							},
						}
					: undefined),
			}}
			onClick={isDisabled ? undefined : onClick}
			aria-disabled={isDisabled || undefined}
		>
			<HStack justify="flex-start" w="full" gap={2}>
				{icon}
				<span>{label}</span>
			</HStack>
		</Button>
	);
}
