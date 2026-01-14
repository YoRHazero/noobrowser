// @/features/grism/tracesource/global-controls.recipe.ts
import { defineSlotRecipe } from "@chakra-ui/react";

export const globalControlsRecipe = defineSlotRecipe({
	slots: [
		"root",
		"panel",
		"header",
		"label",
		"inputGroup",
		"statusDisplay",
		"actionGroup",
	],
	className: "global-controls",
	base: {
		root: {
			borderTopWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.canvas", // 与 Drawer 背景一致或稍深
			p: 4,
			position: "relative",
			zIndex: 10,
			boxShadow: "0 -4px 20px -5px rgba(0,0,0,0.1)",
			_dark: {
				bg: "blackAlpha.900",
				borderTopColor: "border.accent", // 顶部亮色边框模拟扫描线分割
				boxShadow: "0 -10px 30px -10px rgba(0, 255, 255, 0.1)",
			},
		},
		panel: {
			display: "flex",
			flexDirection: "column",
			gap: 4,
		},
		label: {
			fontSize: "xs",
			fontWeight: "semibold",
			textTransform: "uppercase",
			letterSpacing: "wider",
			color: "fg.muted",
			mb: 1.5,
			display: "flex",
			alignItems: "center",
			gap: 1,
			_dark: { color: "cyan.600" },
		},
		inputGroup: {
			display: "flex",
			alignItems: "flex-start", // 防止高度不一致导致对齐问题
			gap: 3,
		},
		statusDisplay: {
			fontFamily: "mono",
			fontSize: "xs",
			color: "fg.muted",
			bg: "bg.subtle",
			px: 2,
			py: 1,
			borderRadius: "sm",
			borderWidth: "1px",
			borderColor: "border.subtle",
			textAlign: "center",
			width: "100%",
			_dark: {
				bg: "whiteAlpha.50",
				borderColor: "whiteAlpha.200",
				color: "cyan.100",
			},
		},
		actionGroup: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 2,
			mt: 1,
		},
	},
});
