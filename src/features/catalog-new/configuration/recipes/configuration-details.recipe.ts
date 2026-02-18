import { defineSlotRecipe } from "@chakra-ui/react";

export const configurationDetailsRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "controls",
    "tabs",
    "tabList",
    "tabTrigger",
    "tabContent",
    "plotContainer",
  ],
  className: "configuration-details",
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "4",
      h: "full",
      color: "fg.muted",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    controls: {
      display: "flex",
      gap: "2",
      alignItems: "center",
    },
    tabs: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      h: "full",
    },
    tabList: {
      borderBottomWidth: "1px",
    },
    tabTrigger: {
      _selected: {
        color: "cyan.400",
        borderColor: "cyan.400",
      },
    },
    tabContent: {
      flex: "1",
      pt: "4",
      position: "relative",
    },
    plotContainer: {
      w: "full",
      h: "full",
      minH: "300px",
      bg: "bg.subtle",
      borderRadius: "md",
      overflow: "hidden",
    },
  },
});
