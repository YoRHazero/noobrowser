import type { SystemStyleObject } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { BeaconEffect } from "../../shared/types";
import { getDockFeedbackStyles } from "../animations/dockFeedback.animations";

interface DockFeedbackLayerProps {
	effect: BeaconEffect | null;
	css: SystemStyleObject;
}

export function DockFeedbackLayer({ effect, css }: DockFeedbackLayerProps) {
	if (!effect) return null;

	const styles = getDockFeedbackStyles(effect);

	return (
		<Box
			css={css}
			data-testid="dock-feedback-layer"
			data-effect-token={effect.token}
		>
			{styles.sweep ? (
				<Box
					key={`dock-sweep-${effect.token}`}
					data-testid="dock-feedback-sweep"
					position="absolute"
					top="0"
					left="-10%"
					w="58%"
					h="2px"
					borderRadius="full"
					css={styles.sweep}
				/>
			) : null}
			{styles.cardGlow ? (
				<Box
					key={`dock-glow-${effect.token}`}
					data-testid="dock-feedback-card-glow"
					position="absolute"
					inset="0"
					borderRadius="inherit"
					css={styles.cardGlow}
				/>
			) : null}
			{styles.rim ? (
				<Box
					key={`dock-rim-${effect.token}`}
					data-testid="dock-feedback-rim"
					position="absolute"
					inset="0"
					borderRadius="inherit"
					css={styles.rim}
				/>
			) : null}
		</Box>
	);
}
