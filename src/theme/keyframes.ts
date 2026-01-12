import { defineKeyframes } from "@chakra-ui/react";

export const keyframes = defineKeyframes({
  // --- 通用/白天动画 ---
  fadeIn: {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },

  // --- 黑夜/科技感动画 ---
  
  // 1. 霓虹呼吸：用于选中项，带有光晕的缩放
  neonBreathe: {
    "0%, 100%": { 
      boxShadow: "0 0 5px {colors.cyan.500}, 0 0 10px {colors.cyan.900}",
      borderColor: "{colors.cyan.400}"
    },
    "50%": { 
      boxShadow: "0 0 15px {colors.cyan.400}, 0 0 25px {colors.cyan.800}",
      borderColor: "{colors.cyan.300}"
    },
  },

  // 2. 扫描线：用于背景或遮罩，从上扫到下
  scanline: {
    "0%": { transform: "translateY(-100%)", opacity: 0 },
    "50%": { opacity: 1 },
    "100%": { transform: "translateY(100%)", opacity: 0 },
  },

  // 3. 故障闪烁：用于 Warning 或 Fetch 动作
  cyberGlitch: {
    "0%": { transform: "translate(0)" },
    "20%": { transform: "translate(-2px, 2px)" },
    "40%": { transform: "translate(-2px, -2px)" },
    "60%": { transform: "translate(2px, 2px)" },
    "80%": { transform: "translate(2px, -2px)" },
    "100%": { transform: "translate(0)" },
  },

  // 4. 缓慢脉冲：用于待机状态 (Idle)
  techPulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.6 },
  },

  // 5. 边框流动效果 (模拟数据传输)
  borderFlow: {
    "0%": { backgroundPosition: "0% 50%" },
    "100%": { backgroundPosition: "100% 50%" },
  }
});