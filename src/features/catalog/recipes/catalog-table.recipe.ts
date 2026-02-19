import { defineSlotRecipe } from "@chakra-ui/react";

export const catalogTableRecipe = defineSlotRecipe({
  slots: ["root", "header", "row", "cell", "pagination"],
  className: "catalog-table",
  base: {
    root: {
      flex: 1,
      overflow: "auto",
      borderWidth: "1px",
      borderRadius: "md",
      bg: "bg.panel",
    },
    header: {
      bg: "bg.subtle",
      fontWeight: "semibold",
      fontSize: "sm",
    },
    row: {
      cursor: "pointer",
      transition: "background 0.2s",
      _hover: {
        bg: "bg.subtle",
      },
      _selected: {
        bg: "blue.subtle",
      },
    },
    cell: {
      px: 3,
      py: 2,
      fontSize: "sm",
      whiteSpace: "nowrap",
    },
    pagination: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 2,
      px: 3,
      borderTopWidth: "1px",
    },
  },
  variants: {
    selected: {
      true: {
        row: {
          bg: "blue.subtle",
        },
      },
    },
  },
});
