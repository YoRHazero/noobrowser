import { Box } from "@chakra-ui/react";
import { Children } from "react";

export const panelStyles = {
	root: {
		display: "flex",
		flexDirection: "column",
		h: "100%",
		minH: 0,
		borderRadius: "md",
		borderWidth: "1px",
		borderColor: "border.subtle",
		position: "relative",
		overflow: "hidden",
		bg: "bg.canvas",
		boxShadow: "shadows.card",
		_dark: {
			bg: "blackAlpha.900",
			borderColor: "whiteAlpha.200",
			boxShadow: "0 0 30px -10px rgba(0, 255, 255, 0.2)",
			bgImage:
				"radial-gradient(circle at 85% 0%, rgba(34, 211, 238, 0.14) 0%, transparent 45%), radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.12) 0%, transparent 50%)",
		},
	},
	topSection: {
		display: "flex",
		flexDirection: "column",
		gap: 5,
		p: 4,
		flexShrink: 0,
	},
	divider: {
		borderColor: "border.subtle",
	},
	scrollSection: {
		flex: 1,
		minH: 0,
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
	},
} as const;

interface PanelProps {
	children: React.ReactNode;
}

export function Panel({ children }: PanelProps) {
	const items = Children.toArray(children);
	const last = items.pop();

	return (
		<Box css={panelStyles.root}>
			{items}
			{last ? <Box css={panelStyles.scrollSection}>{last}</Box> : null}
		</Box>
	);
}
