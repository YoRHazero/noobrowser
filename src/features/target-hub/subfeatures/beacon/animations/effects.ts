import { keyframes } from "@emotion/react";

export const breathPulse = keyframes`
  0%, 100% {
    transform: scale(0.92);
    opacity: 0.22;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.48;
  }
`;

export const haloBurst = keyframes`
  0% {
    transform: scale(0.4);
    opacity: 0.75;
  }
  100% {
    transform: scale(2.15);
    opacity: 0;
  }
`;

export const streakPulse = keyframes`
  0% {
    transform: translateX(-22px) scaleX(0.35);
    opacity: 0;
  }
  30% {
    opacity: 0.95;
  }
  100% {
    transform: translateX(6px) scaleX(1);
    opacity: 0;
  }
`;

export const rimFlash = keyframes`
  0%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 0.95;
  }
`;

export const colorMorph = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.92;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

export const hexToRgb = (hex: string) => {
	const normalized = hex.replace("#", "");
	const expanded =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: normalized;
	const value = Number.parseInt(expanded, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `${r}, ${g}, ${b}`;
};
