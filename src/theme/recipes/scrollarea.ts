import { defineSlotRecipe, defaultConfig } from "@chakra-ui/react";

const defaultScrollArea = defaultConfig.theme?.slotRecipes?.scrollArea;

export const scrollAreaRecipe = defineSlotRecipe({
	slots: ["root", "viewport", "content", "scrollbar", "thumb", "corner"],
	className: "chakra-scroll-area",

	variants: defaultScrollArea?.variants,
	defaultVariants: defaultScrollArea?.defaultVariants,

	base: {
		...defaultScrollArea?.base,
		root: {
			...defaultScrollArea?.base?.root,
		},
		viewport: {
			...defaultScrollArea?.base?.viewport,
		},
		content: {
			...defaultScrollArea?.base?.content,
		},
		scrollbar: {
			...defaultScrollArea?.base?.scrollbar,
			bg: "scrollbar.track",
			borderRadius: "full",
			p: "2px",
		},
		thumb: {
			...defaultScrollArea?.base?.thumb,
			bg: "scrollbar.thumb",
			borderRadius: "full",
			_hover: {
				bg: "scrollbar.thumbHover",
			},
		},
		corner: {
			...defaultScrollArea?.base?.corner,
			bg: "scrollbar.track",
		},
	},
});
