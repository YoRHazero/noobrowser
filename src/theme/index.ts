import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { semanticTokens } from "./semantic-tokens";
import { keyframes } from "./keyframes";

import { drawerRecipe } from "@/theme/recipes/drawer";
import { scrollAreaRecipe } from "@/theme/recipes/scrollarea";

const customConfig = defineConfig({
  theme: {
    semanticTokens: semanticTokens,
    keyframes: keyframes,

    slotRecipes: {
      drawer: drawerRecipe,
      scrollArea: scrollAreaRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
