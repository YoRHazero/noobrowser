import { Box } from "@chakra-ui/react";
import { Application, extend } from "@pixi/react";
import { Container, RenderLayer } from "pixi.js";
import { useEffect, useRef } from "react";
import GlobeBackground from "@/components/pixi/GlobeBackground";
import GlobeGrid from "@/components/pixi/GlobeGrid";
import GlobeViewport from "@/components/pixi/GlobeViewport";
import FootprintTooltip from "@/features/footprint/FootprintTooltip";
import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { useGlobeStore } from "@/stores/footprints";
import type { RenderLayerInstance } from "@/types/pixi-react";
import FootprintManager from "./FootprintManager";

extend({
	Container,
	RenderLayer,
});

type FootprintApiItem = {
	id: string;
	footprint: {
		vertices: number[][];
		center: [number, number];
	};
	meta: Record<string, unknown>;
};

export default function FootprintCanvas() {
	// Render Layers
	const parentRef = useRef<HTMLDivElement | null>(null);
	const worldLayerRef = useRef<RenderLayerInstance | null>(null);
	const backgroundRef = useRef<RenderLayerInstance | null>(null);

	const setBackground = useGlobeStore((state) => state.setGlobeBackground);
	// Consistent with Box size below
	setBackground({
		centerX: 400,
		centerY: 300,
		initialRadius: (Math.min(800, 600) / 2) * 0.9,
	});

	// Footprint Query
	const setFootprints = useGlobeStore((state) => state.setFootprints);
	const footprintQuery = useQueryAxiosGet<FootprintApiItem[]>({
		queryKey: ["grism_footprints"],
		path: "/overview/grism_footprints",
	});
	useEffect(() => {
		if (!footprintQuery.isSuccess) return;
		const footprintData = footprintQuery.data ?? [];
		const footprints = footprintData.map((fp) => ({
			id: fp.id,
			vertices: fp.footprint.vertices.map((v: number[]) => ({
				ra: v[0],
				dec: v[1],
			})),
			meta: {
				...fp.meta,
				center: { ra: fp.footprint.center[0], dec: fp.footprint.center[1] },
			},
		}));
		setFootprints(footprints);
	}, [footprintQuery.data, footprintQuery.isSuccess, setFootprints]);
	return (
		<Box
			ref={parentRef}
			width={"800px"}
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
				<GlobeViewport>
					<pixiRenderLayer ref={backgroundRef} sortableChildren={true} />
					<pixiRenderLayer ref={worldLayerRef} sortableChildren={true} />
					<FootprintManager layerRef={worldLayerRef} />
					<GlobeGrid layerRef={backgroundRef} />
					<GlobeBackground layerRef={backgroundRef} />
					<FootprintTooltip />
				</GlobeViewport>
			</Application>
		</Box>
	);
}
