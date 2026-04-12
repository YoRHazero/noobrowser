import { defineSlotRecipe } from "@chakra-ui/react";

export const resultImageRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-result-image",
	slots: [
		"root",
		"header",
		"title",
		"openLink",
		"frame",
		"spinner",
		"emptyState",
		"errorText",
		"image",
	],
	base: {
		root: {
			gap: 3,
		},
		header: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
		},
		openLink: {
			fontSize: "xs",
		},
		frame: {
			minH: "220px",
			borderWidth: "1px",
			borderRadius: "xl",
			borderColor: "border.subtle",
			bg: "blackAlpha.300",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
		},
		spinner: {
			color: "cyan.300",
		},
		emptyState: {
			fontSize: "sm",
			color: "fg.muted",
		},
		errorText: {
			fontSize: "sm",
			color: "red.200",
			textAlign: "center",
			px: 4,
		},
		image: {
			w: "full",
			objectFit: "contain",
		},
	},
});
