import { defineSlotRecipe } from "@chakra-ui/react";

export const footprintSectionRecipe = defineSlotRecipe({
	className: "target-hub-sheet-footprint-section",
	slots: ["editorRow", "editableField", "readonlyField", "chip"],
	base: {
		editorRow: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
			alignItems: "center",
			w: "full",
		},
		editableField: {
			h: "32px",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.240",
			bg: "rgba(255, 255, 255, 0.06)",
			color: "white",
			fontSize: "sm",
			px: 3,
			w: "full",
			transition:
				"border-color 120ms ease, background 120ms ease, box-shadow 120ms ease",
			_hover: {
				borderColor: "whiteAlpha.320",
				bg: "rgba(255, 255, 255, 0.08)",
			},
			_focusWithin: {
				borderColor: "cyan.300",
				boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.22)",
			},
		},
		readonlyField: {
			minH: "32px",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.100",
			bg: "rgba(255, 255, 255, 0.025)",
			color: "whiteAlpha.860",
			fontSize: "sm",
			px: 3,
			w: "full",
			display: "flex",
			alignItems: "center",
			fontVariantNumeric: "tabular-nums",
		},
		chip: {
			minW: "28px",
			h: "28px",
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "transparent",
			color: "whiteAlpha.820",
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			transition:
				"background 120ms ease, border-color 120ms ease, color 120ms ease",
			_hover: {
				bg: "whiteAlpha.120",
			},
			_disabled: {
				opacity: 0.42,
			},
		},
	},
});
