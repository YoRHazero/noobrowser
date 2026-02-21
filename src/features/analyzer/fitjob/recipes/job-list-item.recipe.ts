import { defineSlotRecipe } from "@chakra-ui/react";

export const jobListItemRecipe = defineSlotRecipe({
	slots: ["root", "jobId"],
	className: "job-list-item",
	base: {
		root: {
			flex: "0 0 auto",
			minW: "200px",
			justifyContent: "space-between",
			alignItems: "center",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "layer.2",
			p: 2,
			cursor: "pointer",
			transition: "all 0.2s",
			_dark: {
				bg: "whiteAlpha.50",
				borderColor: "whiteAlpha.100",
			},
			_hover: {
				borderColor: "border.accent",
				bg: "bg.subtle",
				_dark: {
					bg: "whiteAlpha.100",
					borderColor: "cyan.400",
				},
			},
			_selected: {
				bg: "cyan.50",
				borderColor: "cyan.500",
				_dark: {
					bg: "cyan.900/30",
					borderColor: "cyan.500",
				},
				_hover: {
					bg: "cyan.100",
					_dark: {
						bg: "cyan.900/40",
						borderColor: "cyan.400",
					},
				},
			},
		},
		jobId: {
			fontSize: "xs",
			fontFamily: "mono",
			color: "fg.muted",
		},
	},
});
