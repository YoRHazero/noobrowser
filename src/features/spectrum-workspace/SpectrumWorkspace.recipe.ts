import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrumWorkspaceRecipe = defineSlotRecipe({
	className: "spectrum-workspace",
	slots: [
		"root",
		"body",
		"mainPane",
		"spectrum2dPane",
		"spectrum2dCanvasFrame",
		"spectrum1dPane",
		"sidebarPane",
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
		body: {
			flex: "1 1 auto",
			minH: 0,
			display: "flex",
			flexDirection: {
				base: "column",
				lg: "row",
			},
		},
		mainPane: {
			flex: "1 1 auto",
			minH: 0,
			display: "flex",
			flexDirection: "column",
		},
		spectrum2dPane: {
			flex: "0 0 20%",
			minH: 0,
			w: "100%",
			position: "relative",
			overflow: "visible",
		},
		spectrum2dCanvasFrame: {
			w: "100%",
			h: "100%",
			minH: 0,
			overflow: "hidden",
		},
		spectrum1dPane: {
			flex: "1 1 80%",
			minH: 0,
			w: "100%",
			overflow: "hidden",
		},
		sidebarPane: {
			flex: {
				base: "0 0 20rem",
				lg: "0 0 21rem",
			},
			w: {
				base: "100%",
				lg: "21rem",
			},
			minH: 0,
			overflow: "hidden",
			borderTopWidth: {
				base: "1px",
				lg: 0,
			},
			borderLeftWidth: {
				base: 0,
				lg: "1px",
			},
			borderColor: "border.muted",
			bg: "bg.panel",
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
