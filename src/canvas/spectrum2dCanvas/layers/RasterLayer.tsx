import { Spectrum2DRaster } from "../objects/Spectrum2DRaster";
import type { Spectrum2DCanvasViewModel } from "../shared/types";

export interface RasterLayerProps {
	view: Spectrum2DCanvasViewModel;
}

export function RasterLayer({ view }: RasterLayerProps) {
	return (
		<Spectrum2DRaster
			raster={view.raster}
			colorMap={view.display.colorMap}
			interpolation={view.display.interpolation}
			norm={view.display.norm}
			worldBounds={view.worldBounds}
		/>
	);
}
