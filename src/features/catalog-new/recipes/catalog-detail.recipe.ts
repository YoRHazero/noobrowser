import { defineSlotRecipe } from "@chakra-ui/react";

export const catalogDetailRecipe = defineSlotRecipe({
  slots: ["root", "section", "header", "content", "grid", "item"],
  className: "catalog-detail",
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      p: 4,
      h: "full",
      overflowY: "auto",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    header: {
      fontSize: "sm",
      fontWeight: "semibold",
      color: "fg.muted",
      textTransform: "uppercase",
      letterSpacing: "wider",
    },
    content: {
      bg: "bg.panel",
      borderRadius: "md",
      borderWidth: "1px",
      p: 3,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 3,
    },
    item: {
      display: "flex",
      flexDirection: "column",
    },
  },
});
