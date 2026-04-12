import { IconButton, useSlotRecipe } from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import { triggerButtonRecipe } from "./TriggerButton.recipe";

export interface TriggerButtonProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transitionDelay: string;
}

export function TriggerButton({
	open,
	onOpenChange,
	transitionDelay,
}: TriggerButtonProps) {
	const recipe = useSlotRecipe({ recipe: triggerButtonRecipe });
	const styles = recipe();

	return (
		<IconButton
			aria-label="Open overview viewer controls"
			variant="plain"
			css={styles.root}
			opacity={open ? 0 : 1}
			transform={open ? "scale(0.92)" : "scale(1)"}
			pointerEvents={open ? "none" : "auto"}
			transition={[
				`opacity 0.16s ease ${transitionDelay}`,
				`transform 0.18s ease ${transitionDelay}`,
				"background 0.18s ease",
				"box-shadow 0.18s ease",
			].join(", ")}
			onClick={() => onOpenChange(true)}
		>
			<FiSliders />
		</IconButton>
	);
}
