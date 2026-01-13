import { defineSlotRecipe } from "@chakra-ui/react";

export const redshiftControlsRecipe = defineSlotRecipe({
	slots: ["root", "slider", "inputs"],
	className: "redshift-controls",
	base: {
		root: {
			gap: 3,
		},
		slider: {
			px: 1,
		},
		inputs: {
			gap: 3,
			justifyContent: "space-between",
			alignItems: "flex-end",
			flexWrap: "wrap",
		},
	},
});
