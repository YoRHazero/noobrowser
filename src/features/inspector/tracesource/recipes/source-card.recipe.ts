import { defineSlotRecipe } from "@chakra-ui/react";

export const sourceCardRecipe = defineSlotRecipe({
	slots: ["root", "indicator", "headerText", "subText", "actionGroup"],
	className: "source-card", // 建议加上 className 前缀，方便调试

	// 1. 基础样式
	base: {
		root: {
			position: "relative",
			p: 3,
			borderWidth: "1px",
			borderRadius: "md",
			cursor: "pointer",
			transition: "all 0.2s",

			bg: "bg.card",
			borderColor: "border.subtle",
			boxShadow: "shadows.card",
			animation: "enter",

			_hover: {
				borderColor: "border.accent",
				animation: "hoverInteraction",
			},
		},

		indicator: {
			w: "10px",
			h: "10px",
			borderRadius: "full",
			mt: 1.5,
		},

		headerText: {
			fontSize: "xs",
			fontWeight: "bold",
			fontFamily: "mono",
			color: "fg",
		},

		subText: {
			fontSize: "xs",
			fontFamily: "mono",
			lineHeight: 1.2,
			color: "fg.muted",
		},

		actionGroup: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			gap: 1,
		},
	},

	// 2. 变体
	variants: {
		selected: {
			true: {
				root: {
					bg: "bg.cardSelected",
					borderColor: "border.accent",
					animation: "selected",
				},
				headerText: {
					color: "border.accent",
				},
			},
		},
		processing: {
			true: {
				root: {
					borderColor: "status.loading",
					animation: "processing",
				},
			},
		},
	},
});
