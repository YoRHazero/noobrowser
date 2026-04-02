import type { SystemStyleObject } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import type { BeaconEffect } from "../../shared/types";
import {
	getDockFeedbackStyles,
	getDockNoticeLabel,
} from "../animations/dockFeedback.animations";

interface DockStatusNoticeProps {
	effect: BeaconEffect | null;
	css: SystemStyleObject;
}

export function DockStatusNotice({ effect, css }: DockStatusNoticeProps) {
	if (!effect) return null;

	const label = getDockNoticeLabel(effect.kind);
	const styles = getDockFeedbackStyles(effect);

	return (
		<Text
			key={`dock-notice-${effect.token}`}
			css={{ ...css, ...styles.notice }}
			data-testid="dock-status-notice"
			data-effect-token={effect.token}
			aria-live="polite"
		>
			{label}
		</Text>
	);
}
