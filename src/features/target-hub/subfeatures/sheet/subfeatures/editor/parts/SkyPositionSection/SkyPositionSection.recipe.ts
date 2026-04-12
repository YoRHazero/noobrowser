import { defineSlotRecipe } from "@chakra-ui/react";

export const skyPositionSectionRecipe = defineSlotRecipe({
	className: "target-hub-sheet-sky-position-section",
	slots: ["editorRow", "readonlyField", "editableField"],
	base: {
		editorRow: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
			alignItems: "center",
			w: "full",
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
	},
});
