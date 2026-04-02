import type { SystemStyleObject } from "@chakra-ui/react";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import type { BeaconEffect } from "../../shared/types";
import { getDockFeedbackStyles } from "../animations/dockFeedback.animations";
import { DockDotFeedback } from "./DockDotFeedback";
import { DockFeedbackLayer } from "./DockFeedbackLayer";
import { DockStatusNotice } from "./DockStatusNotice";

interface DockSessionCardProps {
	label: string;
	status: string;
	color: string;
	effect: BeaconEffect | null;
	cardCss: SystemStyleObject;
	dotCss: SystemStyleObject;
	statusCss: SystemStyleObject;
	feedbackCss: SystemStyleObject;
	noticeCss: SystemStyleObject;
}

export function DockSessionCard({
	label,
	status,
	color,
	effect,
	cardCss,
	dotCss,
	statusCss,
	feedbackCss,
	noticeCss,
}: DockSessionCardProps) {
	const feedback = getDockFeedbackStyles(effect);

	return (
		<Stack css={cardCss} gap={1.5}>
			<DockFeedbackLayer effect={effect} css={feedbackCss} />
			<HStack gap={2} align="center">
				<HStack gap={2} minW={0}>
					<Box
						position="relative"
						w="10px"
						h="10px"
						flexShrink={0}
						overflow="visible"
					>
						<Box
							css={dotCss}
							w="10px"
							h="10px"
							style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
						/>
						<DockDotFeedback effect={effect} />
					</Box>
					<Text
						key={`dock-session-label-${effect?.token ?? "base"}`}
						fontSize="sm"
						fontWeight="bold"
						fontFamily="mono"
						color="fg"
						css={feedback.label}
					>
						{label}
					</Text>
				</HStack>
				<Text
					key={`dock-session-status-${effect?.token ?? "base"}`}
					marginInlineStart="auto"
					css={{ ...statusCss, ...feedback.status }}
				>
					{status}
				</Text>
			</HStack>
			<Text fontSize="xs" color="fg.muted">
				Prototype session anchor
			</Text>
			<DockStatusNotice effect={effect} css={noticeCss} />
		</Stack>
	);
}
