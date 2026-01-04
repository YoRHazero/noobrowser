"use client";

import { Stack, Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";

import { CompactNumberInput } from "@/components/ui/compact-number-input";
import ModelCardShell from "@/features/grism/forwardfit/ModelCardShell";
import {
	useFitRangeClamp,
	useFitStepScaler,
	useWavelengthUpdate,
} from "@/hook/fitting-hook";
import { useFitStore } from "@/stores/fit";
import type {
	FitGaussianModel,
	WaveFrame,
	WaveUnit,
} from "@/stores/stores-types";
import {
	ANGSTROM_PER_MICRON,
	SPEED_OF_LIGHT_KM_S,
	toDisplayWavelength,
	toInputValue,
} from "@/utils/wavelength";

interface GaussianModelCardProps {
	model: FitGaussianModel;
	waveFrame: WaveFrame;
	waveUnit: WaveUnit;
	zRedshift: number;
	slice1DWaveRange: { min: number; max: number };
}

export default function GaussianModelCard(props: GaussianModelCardProps) {
	const { model, waveFrame, waveUnit, zRedshift, slice1DWaveRange } = props;

	const { updateModel, removeModel, renameModel, toggleActive } = useFitStore(
		useShallow((state) => ({
			updateModel: state.updateModel,
			removeModel: state.removeModel,
			renameModel: state.renameModel,
			toggleActive: state.toggleActive,
		})),
	);

	// 1. Steps
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

	// 2. Value Handlers
	const createHandler = useWavelengthUpdate(waveUnit, waveFrame, zRedshift);

	const handleA = (v: number) => updateModel(model.id, { amplitude: v });
	const handleMu = createHandler((v) => updateModel(model.id, { mu: v }));
	// Sigma is absolute width, but scales same as wavelength
	const handleSigma = createHandler((v) =>
		updateModel(model.id, { sigma: Math.abs(v) }),
	);

	const handleX1 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, min: v } }),
	);
	const handleX2 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, max: v } }),
	);
	// 3. Clamping
	const { clampMinOnBlur, clampMaxOnBlur } = useFitRangeClamp({
		modelRange: model.range,
		sliceRange: slice1DWaveRange,
		onUpdate: (range) => updateModel(model.id, { range }),
	});

	// 4. Display Calculations
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

	// FWHM Info Calculation
	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
	const sigmaFrameUm =
		waveFrame === "observe" ? model.sigma : model.sigma / (zFactor || 1);
	const muFrameUm =
		waveFrame === "observe" ? model.mu : model.mu / (zFactor || 1);
	const fwhmUm = 2.354820045 * sigmaFrameUm;
	const fwhmInUnit = waveUnit === "µm" ? fwhmUm : fwhmUm * ANGSTROM_PER_MICRON;
	const fwhmVelocity =
		muFrameUm > 0 ? (fwhmUm / muFrameUm) * SPEED_OF_LIGHT_KM_S : 0;

	return (
		<ModelCardShell
			name={model.name}
			onRename={(n) => renameModel(model.id, n)}
			color={model.color}
			onColorChange={(c) => updateModel(model.id, { color: c })}
			active={model.active}
			onToggleActive={(a) => toggleActive(model.id, a)}
			onRemove={() => removeModel(model.id)}
			stepControls={[
				{
					key: "A",
					label: "A step",
					value: steps.A,
					onChange: (v) => setSingleStep("A", v),
				},
				{
					key: "mu",
					label: "μ step",
					value: steps.mu,
					onChange: (v) => setSingleStep("mu", v),
				},
				{
					key: "sigma",
					label: "σ step",
					value: steps.sigma,
					onChange: (v) => setSingleStep("sigma", v),
				},
				{
					key: "range",
					label: "range step",
					value: steps.range,
					onChange: (v) => setSingleStep("range", v),
				},
			]}
			formula={<Text>y = A·exp(−(x−μ)²/2σ²) &nbsp; (x1 &lt; x &lt; x2)</Text>}
		>
			<Stack gap={1}>
				<CompactNumberInput
					label="A"
					value={model.amplitude}
					step={steps.A}
					onChange={handleA}
					decimalScale={6}
				/>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="μ"
						value={displayMu}
						step={steps.mu}
						onChange={handleMu}
					/>
					<CompactNumberInput
						label="σ"
						value={displaySigma}
						step={steps.sigma}
						onChange={handleSigma}
					/>
				</Stack>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="x1"
						value={displayX1}
						step={steps.range}
						onChange={handleX1}
						onBlur={clampMinOnBlur}
					/>
					<CompactNumberInput
						label="x2"
						value={displayX2}
						step={steps.range}
						onChange={handleX2}
						onBlur={clampMaxOnBlur}
					/>
				</Stack>

				<Text textStyle="xs" color="fg.muted">
					FWHM ≈{" "}
					{waveUnit === "µm"
						? toInputValue(fwhmInUnit, 4)
						: toInputValue(fwhmInUnit, 1)}{" "}
					{waveUnit} ({toInputValue(fwhmVelocity, 1)} km/s)
				</Text>
			</Stack>
		</ModelCardShell>
	);
}
