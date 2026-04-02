import type { SystemStyleObject } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { MouseEventHandler, PointerEventHandler } from "react";

interface BeaconCoreProps {
	color: string;
	shellCss: SystemStyleObject;
	coreCss: SystemStyleObject;
	isDragging: boolean;
	onPointerDown: PointerEventHandler<HTMLDivElement>;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export function BeaconCore({
	color,
	shellCss,
	coreCss,
	isDragging,
	onPointerDown,
	onClick,
}: BeaconCoreProps) {
	return (
		<Box
			as="button"
			aria-label="Open Target Hub"
			css={{
				...shellCss,
				cursor: isDragging ? "grabbing" : shellCss.cursor,
			}}
			onPointerDown={onPointerDown}
			onClick={onClick}
		>
			<Box
				css={coreCss}
				style={{ backgroundColor: color, boxShadow: `0 0 18px ${color}` }}
			/>
		</Box>
	);
}
