import { keyframes } from "@emotion/react";

const dockEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-14px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const dockExit = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-10px) scale(0.98);
  }
`;

export const getDockAnimation = (state: "enter" | "exit") =>
	state === "enter"
		? `${dockEnter} 220ms ease-out forwards`
		: `${dockExit} 180ms ease-in forwards`;
