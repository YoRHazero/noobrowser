import { keyframes } from "@emotion/react";

export const pulseKeyframe = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(0, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
`;

export const drawerStyle = {
	contentBg: "#09090b",
	contentBorderLeft: "1px solid #333",
	headerBorderBottom: "1px solid #222",
};

export const footerStyle = {
	borderTop: "1px solid #333",
	bg: "black",
};

export const sourceCardStyle = {
	baseBg: "whiteAlpha.50",
	baseBorder: "whiteAlpha.200",
	mainBg: "cyan.900/30",
	mainBorder: "cyan.500",

	hoverBaseBg: "whiteAlpha.100",
	hoverBaseBorder: "whiteAlpha.400",
	hoverMainBg: "cyan.900/40",
	hoverMainBorder: "cyan.400",
};
