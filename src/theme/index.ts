import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { semanticTokens } from "./semantic-tokens";
import { keyframes } from "./keyframes";

import { drawerRecipe } from "@/theme/recipes/drawer";

const customConfig = defineConfig({
  theme: {
    semanticTokens: semanticTokens,
    keyframes: keyframes,

    slotRecipes: {
      drawer: drawerRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
