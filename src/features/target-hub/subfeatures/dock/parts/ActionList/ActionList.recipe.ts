import { defineSlotRecipe } from "@chakra-ui/react";

export const dockActionListRecipe = defineSlotRecipe({
	className: "target-hub-dock-action-list",
	slots: ["root"],
	base: {
		root: {
			gap: 1.5,
			mt: 3,
		},
	},
});
