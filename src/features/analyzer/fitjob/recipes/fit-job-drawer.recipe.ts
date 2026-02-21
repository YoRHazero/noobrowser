import { defineSlotRecipe } from "@chakra-ui/react";

export const fitJobDrawerRecipe = defineSlotRecipe({
	slots: ["content", "header", "body", "footer", "heading", "emptyState", "errorText"],
	className: "fit-job-drawer",
	base: {
		content: {
			bg: "bg.canvas",
			borderLeftWidth: "1px",
			borderColor: "border.subtle",
			_dark: {
				bg: "gray.950", // Or specific dark bg if needed, typically bg.canvas handles this
				borderColor: "whiteAlpha.200",
			},
		},
		header: {
			borderBottomWidth: "1px",
			borderColor: "border.subtle",
			pb: 4,
			_dark: {
				borderColor: "whiteAlpha.200",
			},
		},
		heading: {
			color: "fg.default",
			fontSize: "lg",
			fontWeight: "semibold",
		},
		body: {
			bg: "bg.subtle",
			p: 0,
			_dark: {
				bg: "blackAlpha.200",
			},
		},
		footer: {
			borderTopWidth: "1px",
			borderColor: "border.subtle",
			_dark: {
				borderColor: "whiteAlpha.200",
			},
		},
		emptyState: {
			display: "flex",
			direction: "column",
			alignItems: "center",
			justifyContent: "center",
			height: "full",
			color: "fg.muted",
			gap: 3,
		},
		errorText: {
			color: "red.500",
			_dark: { color: "red.300" },
			fontSize: "sm",
		},
	},
});
