import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	useFitRangeClamp,
	useFitStepScaler,
	useWavelengthUpdate,
} from "@/hook/fitting-hook";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type { FitGaussianModel } from "@/stores/stores-types";
import {
	ANGSTROM_PER_MICRON,
	SPEED_OF_LIGHT_KM_S,
	toDisplayWavelength,
	toInputValue,
} from "@/utils/wavelength";

export function useGaussianModelCard(model: FitGaussianModel) {
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
			A: 0.1,
			mu: waveUnit === "µm" ? 0.001 : 1,
			sigma: waveUnit === "µm" ? 0.001 : 1,
			range: waveUnit === "µm" ? 0.001 : 1,
		},
		waveUnit,
		waveFrame,
		zRedshift,
	});

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const displayMu = toDisplayWavelength(
		model.mu,
		waveUnit,
		waveFrame,
		zRedshift,
	);
	const displaySigma = toDisplayWavelength(
		model.sigma,
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

	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
	const sigmaFrameUm =
		waveFrame === "observe" ? model.sigma : model.sigma / (zFactor || 1);
	const muFrameUm =
		waveFrame === "observe" ? model.mu : model.mu / (zFactor || 1);
	const fwhmUm = 2.354820045 * sigmaFrameUm;
	const fwhmInUnit = waveUnit === "µm" ? fwhmUm : fwhmUm * ANGSTROM_PER_MICRON;
	const fwhmVelocity =
		muFrameUm > 0 ? (fwhmUm / muFrameUm) * SPEED_OF_LIGHT_KM_S : 0;

	const fwhmDisplay = {
		value: toInputValue(fwhmInUnit, waveUnit === "µm" ? 4 : 1),
		velocity: toInputValue(fwhmVelocity, 1),
		unit: waveUnit,
	};

	const stepControls = useMemo(
		() => [
			{
				key: "A",
				label: "A step",
				value: steps.A,
				onChange: (v: number) => setSingleStep("A", v),
			},
			{
				key: "mu",
				label: "μ step",
				value: steps.mu,
				onChange: (v: number) => setSingleStep("mu", v),
			},
			{
				key: "sigma",
				label: "σ step",
				value: steps.sigma,
				onChange: (v: number) => setSingleStep("sigma", v),
			},
			{
				key: "range",
				label: "range step",
				value: steps.range,
				onChange: (v: number) => setSingleStep("range", v),
			},
		],
		[setSingleStep, steps.A, steps.mu, steps.range, steps.sigma],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const createHandler = useWavelengthUpdate(waveUnit, waveFrame, zRedshift);

	const handleA = (v: number) => updateModel(model.id, { amplitude: v });
	const handleMu = createHandler((v) => updateModel(model.id, { mu: v }));
	const handleSigma = createHandler((v) =>
		updateModel(model.id, { sigma: Math.abs(v) }),
	);
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
			amplitude: model.amplitude,
		},
		display: {
			mu: displayMu,
			sigma: displaySigma,
			x1: displayX1,
			x2: displayX2,
		},
		steps,
		stepControls,
		fwhmDisplay,
		handleA,
		handleMu,
		handleSigma,
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
