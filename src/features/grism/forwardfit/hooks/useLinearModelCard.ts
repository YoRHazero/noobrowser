import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	useFitRangeClamp,
	useFitStepScaler,
	useWavelengthUpdate,
} from "@/hook/fitting-hook";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitLinearModel } from "@/stores/stores-types";
import { toDisplayWavelength } from "@/utils/wavelength";

export function useLinearModelCard(model: FitLinearModel) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { updateModel, removeModel, renameModel, toggleActive, waveFrame } =
		useFitStore(
			useShallow((state) => ({
				updateModel: state.updateModel,
				removeModel: state.removeModel,
				renameModel: state.renameModel,
				toggleActive: state.toggleActive,
				waveFrame: state.waveFrame,
			})),
		);

	const { waveUnit, zRedshift, slice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
			slice1DWaveRange: state.slice1DWaveRange,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const { steps, setSingleStep } = useFitStepScaler({
		initialSteps: {
			k: 0.1,
			b: 0.1,
			x0: waveUnit === "µm" ? 0.001 : 1,
			range: waveUnit === "µm" ? 0.001 : 1,
		},
		waveUnit,
		waveFrame,
		zRedshift,
	});

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const displayX0 = toDisplayWavelength(
		model.x0,
		waveUnit,
		waveFrame,
		zRedshift,
	);
	const displayX1 = toDisplayWavelength(
		model.range.min,
		waveUnit,
		waveFrame,
		zRedshift,
	);
	const displayX2 = toDisplayWavelength(
		model.range.max,
		waveUnit,
		waveFrame,
		zRedshift,
	);

	const stepControls = useMemo(
		() => [
			{
				key: "k",
				label: "k step",
				value: steps.k,
				onChange: (v: number) => setSingleStep("k", v),
			},
			{
				key: "b",
				label: "b step",
				value: steps.b,
				onChange: (v: number) => setSingleStep("b", v),
			},
			{
				key: "x0",
				label: "x0 step",
				value: steps.x0,
				onChange: (v: number) => setSingleStep("x0", v),
			},
			{
				key: "range",
				label: "range step",
				value: steps.range,
				onChange: (v: number) => setSingleStep("range", v),
			},
		],
		[setSingleStep, steps.b, steps.k, steps.range, steps.x0],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const createHandler = useWavelengthUpdate(waveUnit, waveFrame, zRedshift);

	const handleK = (v: number) => updateModel(model.id, { k: v });
	const handleB = (v: number) => updateModel(model.id, { b: v });
	const handleX0 = createHandler((v) => updateModel(model.id, { x0: v }));
	const handleX1 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, min: v } }),
	);
	const handleX2 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, max: v } }),
	);
	const handleColorChange = (color: string) =>
		updateModel(model.id, { color });
	const handleRename = (name: string) => renameModel(model.id, name);
	const handleToggle = (active: boolean) => toggleActive(model.id, active);
	const handleRemove = () => removeModel(model.id);

	const { clampMinOnBlur, clampMaxOnBlur } = useFitRangeClamp({
		modelRange: model.range,
		sliceRange: slice1DWaveRange,
		onUpdate: (range) => updateModel(model.id, { range }),
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		name: model.name,
		color: model.color,
		active: model.active,
		values: {
			k: model.k,
			b: model.b,
		},
		display: {
			x0: displayX0,
			x1: displayX1,
			x2: displayX2,
		},
		steps,
		stepControls,
		handleK,
		handleB,
		handleX0,
		handleX1,
		handleX2,
		handleColorChange,
		handleRename,
		handleToggle,
		handleRemove,
		clampMinOnBlur,
		clampMaxOnBlur,
	};
}
