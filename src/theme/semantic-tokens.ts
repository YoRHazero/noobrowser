import { defineSemanticTokens } from "@chakra-ui/react";

export const semanticTokens = defineSemanticTokens({
  colors: {
    // 定义应用背景和卡片背景
    bg: {
      canvas: {
        value: { _light: "{colors.gray.50}", _dark: "#050510" }, // 白天/黑夜
      },
      card: {
        value: { _light: "{colors.white}", _dark: "rgba(10, 20, 40, 0.6)" },
      },
      cardSelected: {
        value: { _light: "{colors.blue.50}", _dark: "rgba(0, 200, 255, 0.1)" },
      },
      panel: {
        value: { _light: "{colors.white}", _dark: "rgba(12, 16, 24, 0.9)" },
      },
    },

    // 边框颜色
    border: {
      subtle: {
        value: { _light: "{colors.gray.200}", _dark: "{colors.whiteAlpha.100}" },
      },
      accent: {
        value: { _light: "{colors.blue.600}", _dark: "{colors.cyan.400}" },
      },
    },

    // 状态指示灯颜色
    status: {
      active: {
        value: { _light: "{colors.green.600}", _dark: "{colors.green.400}" },
      },
      loading: {
        value: { _light: "{colors.orange.500}", _dark: "{colors.yellow.300}" },
      },
    },

    // Scrollbar colors
    scrollbar: {
      track: {
        value: { _light: "{colors.gray.100}", _dark: "rgba(255, 255, 255, 0.08)" },
      },
      thumb: {
        value: { _light: "{colors.gray.400}", _dark: "rgba(255, 255, 255, 0.3)" },
      },
      thumbHover: {
        value: { _light: "{colors.gray.500}", _dark: "rgba(255, 255, 255, 0.45)" },
      },
    },
  },

  // --- 关键：根据模式切换动画 ---
  animations: {
    // 1. 卡片进入动画
    // 白天：无，或者极快显现（高效）
    // 黑夜：淡入 + 稍微上浮（高级感）
    enter: {
      value: { _light: "none", _dark: "fadeIn 0.5s ease-out" },
    },

    // 2. 选中状态动画 (Selected State)
    // 白天：静止（清晰）
    // 黑夜：霓虹呼吸循环（炫酷）
    selected: {
      value: { _light: "none", _dark: "neonBreathe 3s ease-in-out infinite" },
    },

    // 3. 加载/处理中 (Processing)
    // 白天：简单的旋转或脉冲
    // 黑夜：故障效果 + 快速闪烁
    processing: {
      value: {
        _light: "techPulse 1s infinite",
        _dark: "cyberGlitch 0.3s steps(2) infinite",
      },
    },

    // 4. 悬停提示 (Interactable Hover)
    // 白天：简单变色，无动画
    // 黑夜：微弱的脉冲
    hoverInteraction: {
      value: { _light: "none", _dark: "techPulse 2s ease-in-out infinite" },
    },
  },

  // 也可以定义阴影
  shadows: {
    card: {
      value: {
        _light: "0 1px 3px rgba(0,0,0,0.1)",
        _dark: "0 0 20px rgba(0, 255, 255, 0.05)",
      },
    },
  },
});
