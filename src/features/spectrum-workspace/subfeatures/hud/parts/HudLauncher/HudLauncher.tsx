import { IconButton, useSlotRecipe } from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import { Tooltip } from "@/components/ui/tooltip";
import { hudLauncherRecipe } from "./HudLauncher.recipe";

export interface HudLauncherProps {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	transitionDelay: string;
}

export function HudLauncher({
	open,
	onOpenChange,
	transitionDelay,
}: HudLauncherProps) {
	const collapsedTransformX = "8%";
	const recipe = useSlotRecipe({ recipe: hudLauncherRecipe });
	const styles = recipe();

	return (
		<Tooltip content="2D Controls">
			<IconButton
				aria-label="Open 2D spectrum controls"
				variant="plain"
				css={styles.root}
				opacity={open ? 0 : 1}
				transform={
					open
						? `translate(${collapsedTransformX}, 50%) scale(0.92)`
						: `translate(${collapsedTransformX}, 50%) scale(1)`
				}
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
		</Tooltip>
	);
}
