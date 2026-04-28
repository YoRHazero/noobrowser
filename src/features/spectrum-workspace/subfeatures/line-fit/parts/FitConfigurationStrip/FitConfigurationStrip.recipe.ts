import { defineSlotRecipe } from "@chakra-ui/react";

export const fitConfigurationStripRecipe = defineSlotRecipe({
	className: "spectrum-workspace-line-fit-configuration-strip",
	slots: ["root", "createRail", "createButton"],
	base: {
		root: {
			gap: 2,
			overflowX: "auto",
			pb: 1,
			alignItems: "stretch",
		},
		createRail: {
			position: "sticky",
			left: 0,
			zIndex: 1,
			bg: "bg.panel",
			flex: "0 0 auto",
			pr: 1,
		},
		createButton: {
			minW: "4rem",
			h: "5.25rem",
		},
	},
});
