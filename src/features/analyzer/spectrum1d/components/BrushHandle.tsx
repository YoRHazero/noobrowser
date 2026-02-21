import type { BrushHandleRenderProps } from "@visx/brush";
import { Group } from "@visx/group";
import { memo } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

const BrushHandle = memo(function BrushHandle({
	x,
	height,
	isBrushActive = true,
}: BrushHandleRenderProps) {
	const handleWidth = 8;
	const handleHeight = 15;
	const handleFill = useColorModeValue(
		"var(--chakra-colors-gray-50)",
		"var(--chakra-colors-whiteAlpha-100)",
	);
	const handleStroke = useColorModeValue(
		"var(--chakra-colors-gray-400)",
		"var(--chakra-colors-cyan-400)",
	);
	if (!isBrushActive) {
		return null;
	}
	return (
		<Group left={x + handleWidth / 2} top={(height - handleHeight) / 2}>
			<path
				fill={handleFill}
				d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
				stroke={handleStroke}
				strokeWidth={1}
				style={{ cursor: "ew-resize" }}
			/>
		</Group>
	);
});

export default BrushHandle;
