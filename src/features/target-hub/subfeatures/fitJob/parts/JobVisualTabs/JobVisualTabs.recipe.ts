import { defineSlotRecipe } from "@chakra-ui/react";

export const jobVisualTabsRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-visual-tabs",
	slots: ["root", "list", "trigger", "content"],
	base: {
		root: {
			gap: 3,
		},
		list: {
			bg: "blackAlpha.200",
			borderWidth: "1px",
			borderColor: "border.subtle",
			borderRadius: "xl",
			p: 1,
			gap: 1,
		},
		trigger: {
			fontSize: "sm",
			color: "fg.muted",
		},
		content: {
			pt: 2,
		},
	},
});
