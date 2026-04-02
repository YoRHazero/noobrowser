import { Box } from "@chakra-ui/react";
import type { BeaconEffect } from "../../shared/types";
import { getDockFeedbackStyles } from "../animations/dockFeedback.animations";

interface DockDotFeedbackProps {
	effect: BeaconEffect | null;
}

export function DockDotFeedback({ effect }: DockDotFeedbackProps) {
	if (!effect) return null;

	const styles = getDockFeedbackStyles(effect);

	return (
		<>
			{styles.dotPrimary ? (
				<Box
					key={`dock-dot-primary-${effect.token}`}
					data-testid="dock-feedback-dot-primary"
					position="absolute"
					inset="0"
					borderWidth="2px"
					borderRadius="full"
					pointerEvents="none"
					css={styles.dotPrimary}
				/>
			) : null}
			{styles.dotSecondary ? (
				<Box
					key={`dock-dot-secondary-${effect.token}`}
					data-testid="dock-feedback-dot-secondary"
					position="absolute"
					inset="0"
					borderWidth="2px"
					borderRadius="full"
					pointerEvents="none"
					css={styles.dotSecondary}
				/>
			) : null}
		</>
	);
}
