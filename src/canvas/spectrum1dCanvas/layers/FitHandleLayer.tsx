import type { ScaleLinear } from "d3-scale";
import type {
	Spectrum1DCanvasActions,
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasWaveRange,
} from "../api";
import { useFitHandleDrag } from "../canvasHooks/useFitHandleDrag";
import { GaussianFitHandles } from "../objects/GaussianFitHandles";
import { LinearFitHandles } from "../objects/LinearFitHandles";
import type { ScreenAnchor } from "../shared/types";

export function FitHandleLayer({
	models,
	xScale,
	yScale,
	height,
	anchor,
	sliceRange,
	actions,
}: {
	models: Spectrum1DCanvasFitModel[];
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	height: number;
	anchor: ScreenAnchor;
	sliceRange: Spectrum1DCanvasWaveRange;
	actions: Spectrum1DCanvasActions;
}) {
	const { drag, startDrag, updateDrag, endDrag } = useFitHandleDrag({
		commitFitModelEdit: actions.commitFitModelEdit,
	});
	const updateFitModel = actions.updateFitModel;

	if (!updateFitModel || models.length === 0 || height <= 0) {
		return null;
	}

	return (
		<g transform={`translate(${anchor.left}, ${anchor.top})`}>
			{models.map((model) =>
				model.kind === "gaussian" ? (
					<GaussianFitHandles
						key={`fit-handle-gaussian-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						height={height}
						sliceRange={sliceRange}
						drag={drag}
						startDrag={startDrag}
						updateDrag={updateDrag}
						endDrag={endDrag}
						updateFitModel={updateFitModel}
					/>
				) : (
					<LinearFitHandles
						key={`fit-handle-linear-${model.id}`}
						model={model}
						xScale={xScale}
						yScale={yScale}
						height={height}
						sliceRange={sliceRange}
						drag={drag}
						startDrag={startDrag}
						updateDrag={updateDrag}
						endDrag={endDrag}
						updateFitModel={updateFitModel}
					/>
				),
			)}
		</g>
	);
}
