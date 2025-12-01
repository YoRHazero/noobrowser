import { Box } from "@chakra-ui/react";
import { Application, extend } from "@pixi/react";
import { Container, RenderLayer } from "pixi.js";
import { useRef } from "react";
import CutoutImage from "@/features/counterpart/CutoutImage";

extend({
	Container,
	RenderLayer,
});
export default function CutoutCanvas() {
	const parentRef = useRef<HTMLDivElement | null>(null);
	return (
		<Box
			ref={parentRef}
			width={"600px"}
			height={"600px"}
			border={"1px solid black"}
		>
			<Application
				resizeTo={parentRef}
				backgroundColor={0xffffff}
				resolution={1}
				antialias={true}
				autoDensity={true}
			>
				<CutoutImage />
			</Application>
		</Box>
	);
}
