import { defineSlotRecipe } from "@chakra-ui/react";

export const fitConfigurationCardRecipe = defineSlotRecipe({
	className: "spectrum-workspace-line-fit-configuration-card",
	slots: [
		"root",
		"body",
		"header",
		"nameInput",
		"controlWrap",
		"priorButton",
		"deleteButton",
		"metaRow",
		"metaStack",
		"summaryText",
		"stateText",
		"jobToggle",
		"jobLabel",
		"switchControl",
	],
	base: {
		root: {
			flex: "0 0 10.75rem",
			minW: 0,
			borderWidth: "1px",
			borderRadius: "md",
			borderColor: "border.muted",
			bg: "bg",
			px: 2,
			py: 2,
			cursor: "pointer",
			transition: "border-color 0.15s ease, background 0.15s ease",
			_hover: {
				borderColor: "border.emphasized",
			},
		},
		body: {
			gap: 1,
		},
		header: {
			gap: 1,
			alignItems: "center",
		},
		nameInput: {
			px: 1,
			fontWeight: "semibold",
		},
		controlWrap: {
			display: "inline-flex",
		},
		priorButton: {
			flex: "0 0 auto",
			_disabled: {
				opacity: 0.45,
			},
		},
		deleteButton: {
			flex: "0 0 auto",
			color: "red.fg",
			_hover: {
				bg: "red.subtle",
			},
		},
		metaRow: {
			gap: 2,
			justifyContent: "space-between",
			alignItems: "center",
		},
		metaStack: {
			gap: 0,
			minW: 0,
		},
		summaryText: {
			fontSize: "2xs",
			color: "fg.muted",
			lineClamp: 1,
		},
		stateText: {
			fontSize: "2xs",
			color: "fg.subtle",
			lineClamp: 1,
		},
		jobToggle: {
			gap: 1,
			flex: "0 0 auto",
		},
		jobLabel: {
			fontSize: "2xs",
			color: "fg.muted",
		},
		switchControl: {
			_checked: {
				bg: "cyan.500",
			},
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					borderColor: "cyan.400",
					bg: "cyan.subtle",
					_hover: {
						borderColor: "cyan.400",
					},
				},
				stateText: {
					color: "cyan.fg",
				},
			},
		},
	},
	defaultVariants: {
		selected: false,
	},
});
