import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrumWorkspaceRecipe = defineSlotRecipe({
	className: "spectrum-workspace",
	slots: [
		"root",
		"spectrum2dPane",
		"spectrum1dPane",
		"message",
		"messageTitle",
		"messageDetail",
	],
	base: {
		root: {
			w: "100%",
			h: "100vh",
			minH: 0,
			display: "flex",
			flexDirection: "column",
			position: "relative",
			overflow: "hidden",
			bg: "bg",
			color: "fg",
		},
		spectrum2dPane: {
			flex: "0 0 20%",
			minH: 0,
			w: "100%",
			overflow: "hidden",
		},
		spectrum1dPane: {
			flex: "1 1 80%",
			minH: 0,
			w: "100%",
			overflow: "hidden",
		},
		message: {
			w: "100%",
			h: "100%",
			minH: 0,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: 1,
			px: 6,
			textAlign: "center",
			color: "fg.muted",
		},
		messageTitle: {
			fontSize: "sm",
			fontWeight: "medium",
		},
		messageDetail: {
			fontSize: "xs",
			color: "fg.subtle",
		},
	},
});
