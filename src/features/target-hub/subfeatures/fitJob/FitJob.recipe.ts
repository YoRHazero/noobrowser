import { defineSlotRecipe } from "@chakra-ui/react";
import { FIT_JOB_DRAWER_WIDTH } from "./shared/constants";

export const fitJobRecipe = defineSlotRecipe({
	className: "target-hub-fit-job",
	slots: [
		"backdrop",
		"content",
		"header",
		"titleRow",
		"titleStack",
		"title",
		"subtitle",
		"closeButton",
		"body",
		"grid",
		"footer",
	],
	base: {
		backdrop: {
			bg: "blackAlpha.500",
			backdropFilter: "blur(6px)",
		},
		content: {
			w: `${FIT_JOB_DRAWER_WIDTH}px`,
			maxW: "calc(100vw - 24px)",
			h: "calc(100vh - 24px)",
			my: "12px",
			mr: "12px",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			borderLeftWidth: "1px",
			borderColor: "border.subtle",
			borderRadius: "24px 0 0 24px",
			bg: "bg.panel",
			boxShadow: "0 24px 80px rgba(2, 8, 23, 0.45)",
		},
		header: {
			p: 5,
			pb: 4,
			borderBottomWidth: "1px",
			borderColor: "border.subtle",
		},
		titleRow: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: 4,
		},
		titleStack: {
			gap: 0,
		},
		title: {
			fontSize: "lg",
			fontWeight: "semibold",
			letterSpacing: "-0.02em",
		},
		subtitle: {
			fontSize: "sm",
			color: "fg.muted",
		},
		closeButton: {
			flexShrink: 0,
		},
		body: {
			flex: 1,
			p: 5,
			overflow: "hidden",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "minmax(280px, 0.88fr) minmax(0, 1.4fr)",
			gap: 4,
			h: "full",
			minH: 0,
		},
		footer: {
			p: 5,
			pt: 4,
			borderTopWidth: "1px",
			borderColor: "border.subtle",
		},
	},
});
