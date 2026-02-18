import { defineSlotRecipe } from "@chakra-ui/react";

export const catalogLayoutRecipe = defineSlotRecipe({
  slots: ["root", "leftPanel", "rightPanel", "header"],
  className: "catalog-layout",
  base: {
    root: {
      display: "grid",
      gridTemplateColumns: "350px 1fr",
      gridTemplateRows: "100vh",
      h: "100vh",
      overflow: "hidden",
      bg: "bg.canvas",
    },
    leftPanel: {
      borderRightWidth: "1px",
      borderColor: "border.subtle",
      h: "full",
      display: "flex",
      flexDirection: "column",
    },
    rightPanel: {
      h: "full",
      overflow: "hidden",
      bg: "bg.panel",
    },
    header: {
      p: 4,
      borderBottomWidth: "1px",
      borderColor: "border.subtle",
    },
  },
});
