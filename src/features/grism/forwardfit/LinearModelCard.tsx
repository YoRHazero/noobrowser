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
	FitLinearModel,
	WaveFrame,
	WaveUnit,
} from "@/stores/stores-types";
import { toDisplayWavelength } from "@/utils/wavelength";

interface LinearModelCardProps {
	model: FitLinearModel;
	waveFrame: WaveFrame;
	waveUnit: WaveUnit;
	zRedshift: number;
	slice1DWaveRange: { min: number; max: number };
}

export default function LinearModelCard(props: LinearModelCardProps) {
	const { model, waveFrame, waveUnit, zRedshift, slice1DWaveRange } = props;

	// 1. Store Actions
	const { updateModel, removeModel, renameModel, toggleActive } = useFitStore(
		useShallow((state) => ({
			updateModel: state.updateModel,
			removeModel: state.removeModel,
			renameModel: state.renameModel,
			toggleActive: state.toggleActive,
		})),
	);

	// 2. Custom Hooks: Step Scaling
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

	// 3. Custom Hooks: Value Update Handlers (Display -> Micron)
	const createHandler = useWavelengthUpdate(waveUnit, waveFrame, zRedshift);

	const handleK = (v: number) => updateModel(model.id, { k: v });
	const handleB = (v: number) => updateModel(model.id, { b: v });
	const handleX0 = createHandler((v) => updateModel(model.id, { x0: v }));

	// Range handlers need special care for min vs max
	const handleX1 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, min: v } }),
	);
	const handleX2 = createHandler((v) =>
		updateModel(model.id, { range: { ...model.range, max: v } }),
	);

	// 4. Custom Hooks: Clamping
	const { clampMinOnBlur, clampMaxOnBlur } = useFitRangeClamp({
		modelRange: model.range,
		sliceRange: slice1DWaveRange,
		onUpdate: (range) => updateModel(model.id, { range }),
	});

	// 5. Display Values
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

	return (
		<ModelCardShell
			name={model.name}
			onRename={(name) => renameModel(model.id, name)}
			color={model.color}
			onColorChange={(c) => updateModel(model.id, { color: c })}
			active={model.active}
			onToggleActive={(a) => toggleActive(model.id, a)}
			onRemove={() => removeModel(model.id)}
			stepControls={[
				{
					key: "k",
					label: "k step",
					value: steps.k,
					onChange: (v) => setSingleStep("k", v),
				},
				{
					key: "b",
					label: "b step",
					value: steps.b,
					onChange: (v) => setSingleStep("b", v),
				},
				{
					key: "x0",
					label: "x0 step",
					value: steps.x0,
					onChange: (v) => setSingleStep("x0", v),
				},
				{
					key: "range",
					label: "range step",
					value: steps.range,
					onChange: (v) => setSingleStep("range", v),
				},
			]}
			formula={<Text>y = k(x − x0) + b &nbsp; (x1 &lt; x &lt; x2)</Text>}
		>
			<Stack gap={1}>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="k"
						value={model.k}
						step={steps.k}
						onChange={handleK}
						decimalScale={6}
					/>
					<CompactNumberInput
						label="b"
						value={model.b}
						step={steps.b}
						onChange={handleB}
						decimalScale={6}
					/>
				</Stack>
				<CompactNumberInput
					label="x0"
					value={displayX0}
					step={steps.x0}
					onChange={handleX0}
				/>
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
			</Stack>
		</ModelCardShell>
	);
}
