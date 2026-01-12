import { defineSlotRecipe, defaultConfig } from "@chakra-ui/react";

const defaultDrawer = defaultConfig.theme?.slotRecipes?.drawer;

export const drawerRecipe = defineSlotRecipe({
  slots: [
    "root", "backdrop", "positioner", "content", 
    "header", "body", "footer", "closeTrigger"
  ],
  className: "chakra-drawer",
  
  // 保留默认变体逻辑
  variants: defaultDrawer?.variants,
  defaultVariants: defaultDrawer?.defaultVariants,

  base: {
    ...defaultDrawer?.base,

    backdrop: {
      ...defaultDrawer?.base?.backdrop,
      bg: "blackAlpha.600",
      backdropFilter: "blur(4px)",
      _dark: { bg: "blackAlpha.800" },
    },

    content: {
      ...defaultDrawer?.base?.content,
      bg: "bg.canvas",
      color: "fg",
      borderLeftWidth: "1px",
      borderColor: "border.subtle",
      boxShadow: "lg",
      _dark: {
        boxShadow: "0 0 30px -5px rgba(0, 255, 255, 0.15)",
        borderLeftColor: "whiteAlpha.200",
      },
    },

    header: {
      ...defaultDrawer?.base?.header,
      px: 4,
      py: 4,
      borderBottomWidth: "1px",
      borderColor: "border.subtle",
    },
    body: { ...defaultDrawer?.base?.body, px: 4, py: 4 },
    footer: {
      ...defaultDrawer?.base?.footer,
      px: 4,
      py: 4,
      borderTopWidth: "1px",
      borderColor: "border.subtle",
    },
    closeTrigger: {
      ...defaultDrawer?.base?.closeTrigger,
      top: 3,
      right: 3,
      color: "fg.muted",
      _hover: { color: "fg", bg: "bg.subtle" },
    },
  },
});
