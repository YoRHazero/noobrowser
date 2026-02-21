import { defineSlotRecipe } from "@chakra-ui/react";

export const fitTransferListboxRecipe = defineSlotRecipe({
	slots: [
		"root",
		"panel",
		"label",
		"content",
		"groupLabel",
		"item",
		"emptyState",
		"emptyText",
		"transferControls",
		"moveButton",
	],
	className: "fit-transfer-listbox",
	base: {
		root: {
			alignItems: "end",
			justifyContent: "center",
			gap: 2,
			flexWrap: "wrap",
		},
		panel: {
			display: "flex",
			flexDirection: "column",
			gap: 1,
			width: "170px",
		},
		label: {
			textStyle: "2xs",
			color: "fg.muted",
			fontWeight: "semibold",
			letterSpacing: "wider",
			textTransform: "uppercase",
		},
		content: {
			maxH: "120px",
			minH: "120px",
			overflowY: "auto",
			bg: "bg.card",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "border.subtle",
			p: 0,
		},
		groupLabel: {
			px: 2,
			py: 1,
			fontSize: "2xs",
			color: "fg.muted",
			bg: "bg.muted",
			fontWeight: "bold",
		},
		item: {
			px: 2,
			py: 1,
			borderRadius: "sm",
			_hover: { bg: "bg.subtle" },
			_selected: {
				bg: { base: "cyan.50", _dark: "cyan.900" },
				color: { base: "cyan.700", _dark: "cyan.200" },
			},
		},
		emptyState: {
			alignItems: "center",
			justifyContent: "center",
			h: "full",
			color: "fg.muted",
		},
		emptyText: {
			fontSize: "xs",
			letterSpacing: "wide",
			opacity: 0.6,
		},
		transferControls: {
			gap: 1,
			pb: 8,
		},
		moveButton: {
			color: "fg.muted",
			_hover: {
				color: "cyan.400",
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			},
		},
	},
});
