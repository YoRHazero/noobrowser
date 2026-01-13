import { curveLinear } from "@visx/curve";
import { LinePath } from "@visx/shape";
import type { ScaleLinear } from "d3-scale";
import { memo, useMemo } from "react";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import { sampleModel } from "@/utils/plot";

interface Spectrum1DFitLayerProps {
	xScale: ScaleLinear<number, number>;
	yScale: ScaleLinear<number, number>;
	samplePoints?: number;
}

const Spectrum1DFitLayer = memo(function Spectrum1DFitLayer(
	props: Spectrum1DFitLayerProps,
) {
	const { xScale, yScale, samplePoints = 201 } = props;
	const models = useFitStore((state) => state.models);
	const gaussianModelsDraw = models.filter(
		(model) =>
			model.kind === "gaussian" && model.active && model.subtracted === false,
	);
	const linearModelsDraw = models.filter(
		(model) =>
			model.kind === "linear" && model.active && model.subtracted === false,
	);
	const sliceRange = useGrismStore((state) => state.slice1DWaveRange);
	const sampleGaussianList = useMemo(() => {
		return gaussianModelsDraw.map((model) => {
			const sampled = sampleModel(model, sliceRange, samplePoints);
			const sampledInChart = sampled.filter(
				(d) =>
					d.wavelength >= sliceRange.min &&
					d.wavelength <= sliceRange.max &&
					yScale(d.flux) !== undefined &&
					yScale(d.flux) >= 0 &&
					yScale(d.flux) <= yScale.range()[0],
			);
			return sampledInChart;
		});
	}, [gaussianModelsDraw, sliceRange, samplePoints, yScale]);
	const sampleLinearList = useMemo(() => {
		return linearModelsDraw.map((model) => {
			const sampled = sampleModel(model, sliceRange);
			return sampled;
		});
	}, [linearModelsDraw, sliceRange]);
	return (
		<g pointerEvents={"none"}>
			{sampleLinearList.map((sampled, index) => {
				if (sampled.length < 2) {
					return null;
				}
				return (
					<LinePath<{ wavelength: number; flux: number }>
						key={`fit-linear-${linearModelsDraw[index].id}`}
						data={sampled}
						x={(d) => xScale(d.wavelength) ?? 0}
						y={(d) => yScale(d.flux) ?? 0}
						stroke={linearModelsDraw[index].color}
						strokeWidth={1}
						curve={curveLinear}
					/>
				);
			})}
			{sampleGaussianList.map((sampled, index) => {
				if (sampled.length < 2) {
					return null;
				}
				return (
					<LinePath<{ wavelength: number; flux: number }>
						key={`fit-gaussian-${gaussianModelsDraw[index].id}`}
						data={sampled}
						x={(d) => xScale(d.wavelength) ?? 0}
						y={(d) => yScale(d.flux) ?? 0}
						stroke={gaussianModelsDraw[index].color}
						strokeWidth={1}
						curve={curveLinear}
					/>
				);
			})}
		</g>
	);
});

export default Spectrum1DFitLayer;
