// features/grism/GrismForwardFit.tsx
"use client";

import {
	Box,
	Button,
	createListCollection,
	Heading,
	HStack,
	IconButton,
	Input,
	Listbox,
	NumberInput,
	Popover,
	Portal,
	Select,
	Stack,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	LuChevronLeft,
	LuChevronRight,
	LuSettings2,
	LuTrash2,
} from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";
import { TabbedColorPicker } from "@/components/ui/color-chooser";
import { Tooltip } from "@/components/ui/tooltip";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";
import type {
	FitGaussianModel,
	FitLinearModel,
	FitModel,
	FitModelType,
	WaveFrame,
	WaveUnit,
} from "@/stores/stores-types";
import {
	ANGSTROM_PER_MICRON,
	displayFactor,
	formatWavelength,
	fromDisplayWavelength,
	SPEED_OF_LIGHT_KM_S,
	toDisplayWavelength,
	toInputValue,
} from "@/utils/wavelength";
import { toaster } from "@/components/ui/toaster";

const modelTypeCollection = createListCollection({
	items: [
		{ label: "Linear", value: "linear" },
		{ label: "Gaussian", value: "gaussian" },
	],
});

interface StepControl {
	key: string;
	label: string;
	value: number;
	onChange: (value: number) => void;
}

/* -------------------------------------------------------------------------- */
/*                             Top-level container                            */
/* -------------------------------------------------------------------------- */

export default function GrismForwardFit() {
	return (
		<Box
			display="inline-flex"
			flexDirection="column"
			gap={4}
			p={4}
			border="1px solid black"
			borderRadius="md"
		>
			<Stack gap={3} w="full" h="full">
				<FitHeaderControls />
				<GrismWavelengthControl />
				<FitModelTransferListBox />
				<FitModelsSection />
			</Stack>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/*                           Header + Add model line                          */
/* -------------------------------------------------------------------------- */

function FitHeaderControls() {
	const syncId = useId();
	const { addModel, models, updateModel, saveCurrentConfiguration } = useFitStore(
		useShallow((state) => ({
			addModel: state.addModel,
			models: state.models,
			updateModel: state.updateModel,
			saveCurrentConfiguration: state.saveCurrentConfiguration,
		})),
	);

	const { slice1DWaveRange } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
		})),
	);

	const [selectedModelType, setSelectedModelType] = useState<string[]>([
		modelTypeCollection.items[0]?.value ?? "linear",
	]);

	const handleAddModel = () => {
		const kind = (selectedModelType[0] as FitModelType) ?? "linear";
		addModel(kind, slice1DWaveRange);
	};
	const syncModelToWindow = () => {
		models.forEach((model) => {
			if (model.kind === "gaussian") {
				const mu = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, mu });
			} else if (model.kind === "linear") {
				const x0 = (slice1DWaveRange.min + slice1DWaveRange.max) / 2;
				updateModel(model.id, { range: slice1DWaveRange, x0 });
			}
		});
	};
	const saveConfiguration = () => {
		saveCurrentConfiguration();
		toaster.create({ title: "Configuration saved", type: "success", duration: 2000 });
	}

	return (
		<HStack justify="space-between" align="center">
			<Heading size="sm" as="h3">
				Model Fitting
			</Heading>
			<HStack gap={2} align="center">
				<Select.Root
					collection={modelTypeCollection}
					size="xs"
					value={selectedModelType}
					onValueChange={({ value }) => setSelectedModelType(value)}
					width="120px"
				>
					<Select.HiddenSelect />
					<Select.Control>
						<Select.Trigger>
							<Select.ValueText placeholder="Model type" />
							<Select.Indicator />
						</Select.Trigger>
					</Select.Control>
					<Portal>
						<Select.Positioner>
							<Select.Content>
								{modelTypeCollection.items.map((item) => (
									<Select.Item item={item} key={item.value}>
										<Select.ItemText>{item.label}</Select.ItemText>
										<Select.ItemIndicator />
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
					</Portal>
				</Select.Root>

				<Button size="xs" variant="solid" onClick={handleAddModel}>
					Add
				</Button>
				<Tooltip
					ids={{ trigger: syncId }}
					content="Update parameters of all models to match current slice wavelength range"
				>
					<Button size="xs" variant="outline" onClick={syncModelToWindow}>
						Sync
					</Button>
				</Tooltip>
				<Tooltip
					content="Save current models as a new configuration"
				>
					<Button size="xs" variant="solid" onClick={saveConfiguration}>
						Save
					</Button>
				</Tooltip>
			</HStack>
		</HStack>
	);
}

/* -------------------------------------------------------------------------- */
/*                         Models section (scrollable)                        */
/* -------------------------------------------------------------------------- */

function FitModelsSection() {
	const {
		models,
		ensureInitialModels,
		updateModel,
		removeModel,
		renameModel,
		toggleActive,
		waveFrame,
	} = useFitStore(
		useShallow((state) => ({
			models: state.models,
			ensureInitialModels: state.ensureInitialModels,
			updateModel: state.updateModel,
			removeModel: state.removeModel,
			renameModel: state.renameModel,
			toggleActive: state.toggleActive,
			waveFrame: state.waveFrame,
		})),
	);

	const { slice1DWaveRange, waveUnit, zRedshift } = useGrismStore(
		useShallow((state) => ({
			slice1DWaveRange: state.slice1DWaveRange,
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
		})),
	);

	useEffect(() => {
		ensureInitialModels(slice1DWaveRange);
	}, [
		ensureInitialModels,
		slice1DWaveRange.min,
		slice1DWaveRange.max,
		slice1DWaveRange,
	]);

	if (models.length === 0) {
		return (
			<Text textStyle="sm" color="fg.muted">
				No models yet. Use the "Add" button to create a model.
			</Text>
		);
	}

	return (
		<Box
			h="635px"
			overflowY="auto"
			borderWidth="1px"
			borderRadius="md"
			borderColor="border.subtle"
			bg="bg"
			p={2}
		>
			<Stack gap={3}>
				{models.map((model) =>
					model.kind === "linear" ? (
						<LinearModelCard
							key={model.id}
							model={model}
							waveFrame={waveFrame}
							waveUnit={waveUnit}
							zRedshift={zRedshift}
							slice1DWaveRange={slice1DWaveRange}
							onUpdate={(id, patch) => updateModel(id, patch)}
							onRemove={removeModel}
							onRename={renameModel}
							onToggleActive={toggleActive}
						/>
					) : (
						<GaussianModelCard
							key={model.id}
							model={model}
							waveFrame={waveFrame}
							waveUnit={waveUnit}
							zRedshift={zRedshift}
							slice1DWaveRange={slice1DWaveRange}
							onUpdate={(id, patch) => updateModel(id, patch)}
							onRemove={removeModel}
							onRename={renameModel}
							onToggleActive={toggleActive}
						/>
					),
				)}
			</Stack>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/*                              Step set popover                              */
/* -------------------------------------------------------------------------- */

interface StepSetPopoverProps {
	controls: StepControl[];
	disabled?: boolean;
}

function StepSetPopover(props: StepSetPopoverProps) {
	const { controls, disabled } = props;

	if (!controls.length) return null;

	// When disabled, just show a disabled button without popover behavior
	if (disabled) {
		return (
			<Button size="xs" variant="ghost" disabled>
				<LuSettings2 />
				<Text as="span" ml="1" textStyle="xs">
					step set
				</Text>
			</Button>
		);
	}

	return (
		<Popover.Root positioning={{ placement: "bottom-end" }}>
			<Popover.Trigger asChild>
				<Button size="xs" variant="ghost">
					<LuSettings2 />
					<Text as="span" ml="1" textStyle="xs">
						step set
					</Text>
				</Button>
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Body>
							<Stack gap={2}>
								{controls.map((control) => (
									<HStack
										key={control.key}
										justify="space-between"
										align="center"
										gap={3}
									>
										<Text textStyle="xs">{control.label}</Text>
										<NumberInput.Root
											size="xs"
											maxW="80px"
											value={toInputValue(control.value, 6)}
											step={control.value || 0.1}
											onValueChange={({ valueAsNumber }) => {
												const next = Number.isFinite(valueAsNumber)
													? valueAsNumber
													: control.value;
												control.onChange(next);
											}}
										>
											<NumberInput.Input />
										</NumberInput.Root>
									</HStack>
								))}
							</Stack>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

/* -------------------------------------------------------------------------- */
/*                              Linear model card                             */
/* -------------------------------------------------------------------------- */

interface BaseModelCardProps {
	waveFrame: WaveFrame;
	waveUnit: WaveUnit;
	zRedshift: number;
	slice1DWaveRange: { min: number; max: number };
	onUpdate: (
		id: number,
		patch: Partial<FitLinearModel> | Partial<FitGaussianModel>,
	) => void;
	onRemove: (id: number) => void;
	onRename: (id: number, name: string) => void;
	onToggleActive: (id: number, active: boolean) => void;
}

interface LinearModelCardProps extends BaseModelCardProps {
	model: FitLinearModel;
}

function LinearModelCard(props: LinearModelCardProps) {
	const { model, waveFrame, waveUnit, zRedshift, slice1DWaveRange } = props;
	const disabled = !model.active;

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

	const [kStep, setKStep] = useState(0.1);
	const [bStep, setBStep] = useState(0.1);
	const [xStep, setXStep] = useState(waveUnit === "µm" ? 0.001 : 1);
	const [rangeStep, setRangeStep] = useState(waveUnit === "µm" ? 0.001 : 1);

	const prevUnitRef = useRef<WaveUnit>(waveUnit);
	const prevFrameRef = useRef<WaveFrame>(waveFrame);

	const activeSwitchId = useId();

	// Scale steps when unit/frame changes (keep same Δµm)
	useEffect(() => {
		const prevUnit = prevUnitRef.current;
		const prevFrame = prevFrameRef.current;

		if (prevUnit === waveUnit && prevFrame === waveFrame) return;

		const oldFactor = displayFactor(prevUnit, prevFrame, zRedshift);
		const newFactor = displayFactor(waveUnit, waveFrame, zRedshift);

		if (
			!Number.isFinite(oldFactor) ||
			oldFactor === 0 ||
			!Number.isFinite(newFactor)
		) {
			prevUnitRef.current = waveUnit;
			prevFrameRef.current = waveFrame;
			return;
		}

		const ratio = newFactor / oldFactor;

		setXStep((prev) => prev * ratio);
		setRangeStep((prev) => prev * ratio);

		prevUnitRef.current = waveUnit;
		prevFrameRef.current = waveFrame;
	}, [waveUnit, waveFrame, zRedshift]);

	const handleKChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		props.onUpdate(model.id, { k: valueAsNumber });
	};

	const handleBChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		props.onUpdate(model.id, { b: valueAsNumber });
	};

	const handleX0Change = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const x0Um = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, { x0: x0Um });
	};

	// x1 / x2 only update own bound; clamp with slice range + other bound on blur
	const handleX1Change = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const newMinUm = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, {
			range: { ...model.range, min: newMinUm } as any,
		});
	};

	const handleX2Change = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const newMaxUm = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, {
			range: { ...model.range, max: newMaxUm } as any,
		});
	};

	const clampX1OnBlur = () => {
		const { min, max } = model.range;
		const sliceMin = slice1DWaveRange.min;
		const sliceMax = slice1DWaveRange.max;

		if (!Number.isFinite(min)) return;

		const upper = Number.isFinite(max) ? max : sliceMax;
		const clampedMin = Math.min(
			Math.max(min, sliceMin),
			Math.min(upper, sliceMax),
		);

		if (clampedMin !== min) {
			props.onUpdate(model.id, {
				range: { min: clampedMin, max } as any,
			});
		}
	};

	const clampX2OnBlur = () => {
		const { min, max } = model.range;
		const sliceMin = slice1DWaveRange.min;
		const sliceMax = slice1DWaveRange.max;

		if (!Number.isFinite(max)) return;

		const lower = Number.isFinite(min) ? min : sliceMin;
		const clampedMax = Math.max(
			Math.min(max, sliceMax),
			Math.max(lower, sliceMin),
		);

		if (clampedMax !== max) {
			props.onUpdate(model.id, {
				range: { min, max: clampedMax } as any,
			});
		}
	};

	const stepControls: StepControl[] = [
		{
			key: "k",
			label: "k step",
			value: kStep,
			onChange: setKStep,
		},
		{
			key: "b",
			label: "b step",
			value: bStep,
			onChange: setBStep,
		},
		{
			key: "x0",
			label: "x0 step",
			value: xStep,
			onChange: setXStep,
		},
		{
			key: "range",
			label: "range step",
			value: rangeStep,
			onChange: setRangeStep,
		},
	];

	const tooltipLabel = model.active
		? "Deactivate this model"
		: "Activate this model";

	const handleColorChange = (value: string) => {
		props.onUpdate(model.id, { color: value });
	};

	return (
		<Stack
			gap={2}
			borderWidth="1px"
			borderRadius="md"
			p={3}
			bg="bg.subtle"
			opacity={model.active ? 1 : 0.6}
		>
			<HStack justify="space-between" align="center">
				<Input
					size="sm"
					fontWeight="semibold"
					value={model.name}
					onChange={(e) => props.onRename(model.id, e.target.value)}
					placeholder="Linear model name"
					disabled={disabled}
				/>

				<HStack gap={1} align="center">
					<TabbedColorPicker
						value={model.color}
						onValueChange={handleColorChange}
					/>
					<Tooltip ids={{ trigger: activeSwitchId }} content={tooltipLabel}>
						<Switch.Root
							size="sm"
							ids={{ root: activeSwitchId }}
							checked={model.active}
							onCheckedChange={(details) =>
								props.onToggleActive(model.id, details.checked)
							}
						>
							<Switch.HiddenInput />
							<Switch.Control />
							<Switch.Label srOnly>Active</Switch.Label>
						</Switch.Root>
					</Tooltip>

					<StepSetPopover controls={stepControls} disabled={disabled} />

					<IconButton
						aria-label="Delete model"
						size="xs"
						variant="ghost"
						onClick={() => props.onRemove(model.id)}
						disabled={disabled}
					>
						<LuTrash2 />
					</IconButton>
				</HStack>
			</HStack>

			<Text textStyle="xs" color="fg.muted">
				y = k · (x − x0) + b &nbsp; (
				{formatWavelength(model.range.min, waveUnit, waveFrame, zRedshift)} &lt;
				x &lt;{" "}
				{formatWavelength(model.range.max, waveUnit, waveFrame, zRedshift)})
			</Text>

			<Stack
				gap={2}
				opacity={disabled ? 0.8 : 1}
				pointerEvents={disabled ? "none" : "auto"}
			>
				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						k
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(model.k, 6)}
						step={kStep}
						onValueChange={({ valueAsNumber }) => handleKChange(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>

					<Text textStyle="sm" minW="36px">
						b
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(model.b, 6)}
						step={bStep}
						onValueChange={({ valueAsNumber }) => handleBChange(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>

				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						x0
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayX0, waveUnit === "µm" ? 6 : 1)}
						step={xStep}
						onValueChange={({ valueAsNumber }) => handleX0Change(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>

				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						x1
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayX1, waveUnit === "µm" ? 6 : 1)}
						step={rangeStep}
						onValueChange={({ valueAsNumber }) => handleX1Change(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX1OnBlur} />
					</NumberInput.Root>

					<Text textStyle="sm" minW="36px">
						x2
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayX2, waveUnit === "µm" ? 6 : 1)}
						step={rangeStep}
						onValueChange={({ valueAsNumber }) => handleX2Change(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX2OnBlur} />
					</NumberInput.Root>
				</HStack>
			</Stack>
		</Stack>
	);
}

/* -------------------------------------------------------------------------- */
/*                             Gaussian model card                            */
/* -------------------------------------------------------------------------- */

interface GaussianModelCardProps extends BaseModelCardProps {
	model: FitGaussianModel;
}

function GaussianModelCard(props: GaussianModelCardProps) {
	const { model, waveFrame, waveUnit, zRedshift, slice1DWaveRange } = props;
	const disabled = !model.active;

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

	const [ampStep, setAmpStep] = useState(0.1);
	const [muStep, setMuStep] = useState(waveUnit === "µm" ? 0.001 : 1);
	const [sigmaStep, setSigmaStep] = useState(waveUnit === "µm" ? 0.001 : 1);
	const [rangeStep, setRangeStep] = useState(waveUnit === "µm" ? 0.001 : 1);
	// temporary place to adjust fwhm km/s range
	const [fwhmStep, setFwhmStep] = useState(100);

	const prevUnitRef = useRef<WaveUnit>(waveUnit);
	const prevFrameRef = useRef<WaveFrame>(waveFrame);

	const activeSwitchId = useId();

	// Scale steps when unit/frame changes (keep same Δµm)
	useEffect(() => {
		const prevUnit = prevUnitRef.current;
		const prevFrame = prevFrameRef.current;

		if (prevUnit === waveUnit && prevFrame === waveFrame) return;

		const oldFactor = displayFactor(prevUnit, prevFrame, zRedshift);
		const newFactor = displayFactor(waveUnit, waveFrame, zRedshift);

		if (
			!Number.isFinite(oldFactor) ||
			oldFactor === 0 ||
			!Number.isFinite(newFactor)
		) {
			prevUnitRef.current = waveUnit;
			prevFrameRef.current = waveFrame;
			return;
		}

		const ratio = newFactor / oldFactor;

		setMuStep((prev) => prev * ratio);
		setSigmaStep((prev) => prev * ratio);
		setRangeStep((prev) => prev * ratio);

		prevUnitRef.current = waveUnit;
		prevFrameRef.current = waveFrame;
	}, [waveUnit, waveFrame, zRedshift]);

	const handleAmplitudeChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		props.onUpdate(model.id, { amplitude: valueAsNumber });
	};

	const handleMuChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const muUm = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, { mu: muUm });
	};

	const handleSigmaChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const sigmaDisplay = Math.abs(valueAsNumber);
		const sigmaUm = fromDisplayWavelength(
			sigmaDisplay,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, { sigma: sigmaUm });
	};

	const handleX1Change = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const newMinUm = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, {
			range: { ...model.range, min: newMinUm } as any,
		});
	};

	const handleX2Change = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const newMaxUm = fromDisplayWavelength(
			valueAsNumber,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		props.onUpdate(model.id, {
			range: { ...model.range, max: newMaxUm } as any,
		});
	};

	const handleFwhmKmsMinChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const [_, maxKms] = model.fwhm_kms_range;
		const minKms = Math.min(valueAsNumber, maxKms - 1);
		props.onUpdate(model.id, { fwhm_kms_range: [minKms, maxKms] });
	};

	const handleFwhmKmsMaxChange = (valueAsNumber: number) => {
		if (!Number.isFinite(valueAsNumber)) return;
		const [minKms, _] = model.fwhm_kms_range;
		const maxKms = Math.max(valueAsNumber, minKms + 1);
		props.onUpdate(model.id, { fwhm_kms_range: [minKms, maxKms] });
	};

	const clampX1OnBlur = () => {
		const { min, max } = model.range;
		const sliceMin = slice1DWaveRange.min;
		const sliceMax = slice1DWaveRange.max;

		if (!Number.isFinite(min)) return;

		const upper = Number.isFinite(max) ? max : sliceMax;
		const clampedMin = Math.min(
			Math.max(min, sliceMin),
			Math.min(upper, sliceMax),
		);

		if (clampedMin !== min) {
			props.onUpdate(model.id, {
				range: { min: clampedMin, max } as any,
			});
		}
	};

	const clampX2OnBlur = () => {
		const { min, max } = model.range;
		const sliceMin = slice1DWaveRange.min;
		const sliceMax = slice1DWaveRange.max;

		if (!Number.isFinite(max)) return;

		const lower = Number.isFinite(min) ? min : sliceMin;
		const clampedMax = Math.max(
			Math.min(max, sliceMax),
			Math.max(lower, sliceMin),
		);

		if (clampedMax !== max) {
			props.onUpdate(model.id, {
				range: { min, max: clampedMax } as any,
			});
		}
	};

	const stepControls: StepControl[] = [
		{
			key: "A",
			label: "Amplitude step",
			value: ampStep,
			onChange: setAmpStep,
		},
		{
			key: "mu",
			label: "μ step",
			value: muStep,
			onChange: setMuStep,
		},
		{
			key: "sigma",
			label: "σ step",
			value: sigmaStep,
			onChange: setSigmaStep,
		},
		{
			key: "range",
			label: "range step",
			value: rangeStep,
			onChange: setRangeStep,
		},
		{
			key: "fwhm_kms",
			label: "FWHM (km/s) step",
			value: fwhmStep,
			onChange: setFwhmStep,
		},
	];

	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
	const sigmaFrameUm =
		waveFrame === "observe" ? model.sigma : model.sigma / (zFactor || 1);
	const muFrameUm =
		waveFrame === "observe" ? model.mu : model.mu / (zFactor || 1);
	const fwhmUm = 2.354820045 * sigmaFrameUm;

	const fwhmInUnit = waveUnit === "µm" ? fwhmUm : fwhmUm * ANGSTROM_PER_MICRON;
	const fwhmVelocity =
		muFrameUm > 0 ? (fwhmUm / muFrameUm) * SPEED_OF_LIGHT_KM_S : 0;

	const tooltipLabel = model.active
		? "Deactivate this model"
		: "Activate this model";

	const handleColorChange = (value: string) => {
		props.onUpdate(model.id, { color: value });
	};

	return (
		<Stack
			gap={2}
			borderWidth="1px"
			borderRadius="md"
			p={3}
			bg="bg.subtle"
			opacity={model.active ? 1 : 0.6}
		>
			<HStack justify="space-between" align="center">
				<Input
					size="sm"
					fontWeight="semibold"
					value={model.name}
					onChange={(e) => props.onRename(model.id, e.target.value)}
					placeholder="Gaussian model name"
					disabled={disabled}
				/>

				<HStack gap={1} align="center">
					<TabbedColorPicker
						value={model.color}
						onValueChange={handleColorChange}
					/>
					<Tooltip ids={{ trigger: activeSwitchId }} content={tooltipLabel}>
						<Switch.Root
							size="sm"
							ids={{ root: activeSwitchId }}
							checked={model.active}
							onCheckedChange={(details) =>
								props.onToggleActive(model.id, details.checked)
							}
						>
							<Switch.HiddenInput />
							<Switch.Control />
							<Switch.Label srOnly>Active</Switch.Label>
						</Switch.Root>
					</Tooltip>

					<StepSetPopover controls={stepControls} disabled={disabled} />

					<IconButton
						aria-label="Delete model"
						size="xs"
						variant="ghost"
						onClick={() => props.onRemove(model.id)}
						disabled={disabled}
					>
						<LuTrash2 />
					</IconButton>
				</HStack>
			</HStack>

			<Text textStyle="xs" color="fg.muted">
				y = A · exp(−(x − μ)² / (2σ²)) &nbsp; (
				{formatWavelength(model.range.min, waveUnit, waveFrame, zRedshift)} &lt;
				x &lt;{" "}
				{formatWavelength(model.range.max, waveUnit, waveFrame, zRedshift)})
			</Text>

			<Stack
				gap={2}
				opacity={disabled ? 0.8 : 1}
				pointerEvents={disabled ? "none" : "auto"}
			>
				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						A
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(model.amplitude, 6)}
						step={ampStep}
						onValueChange={({ valueAsNumber }) =>
							handleAmplitudeChange(valueAsNumber)
						}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>

				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						μ
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayMu, waveUnit === "µm" ? 6 : 1)}
						step={muStep}
						onValueChange={({ valueAsNumber }) => handleMuChange(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>

					<Text textStyle="sm" minW="36px">
						σ
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displaySigma, waveUnit === "µm" ? 6 : 1)}
						step={sigmaStep}
						onValueChange={({ valueAsNumber }) =>
							handleSigmaChange(valueAsNumber)
						}
					>
						<NumberInput.Control />
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>

				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						x1
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayX1, waveUnit === "µm" ? 6 : 1)}
						step={rangeStep}
						onValueChange={({ valueAsNumber }) => handleX1Change(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX1OnBlur} />
					</NumberInput.Root>

					<Text textStyle="sm" minW="36px">
						x2
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(displayX2, waveUnit === "µm" ? 6 : 1)}
						step={rangeStep}
						onValueChange={({ valueAsNumber }) => handleX2Change(valueAsNumber)}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX2OnBlur} />
					</NumberInput.Root>
				</HStack>

				<HStack gap={3} align="center">
					<Text textStyle="sm" minW="36px">
						fwhm1
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(model.fwhm_kms_range[0], 1)}
						step={fwhmStep}
						onValueChange={({ valueAsNumber }) =>
							handleFwhmKmsMinChange(valueAsNumber)
						}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX1OnBlur} />
					</NumberInput.Root>

					<Text textStyle="sm" minW="36px">
						fwhm2
					</Text>
					<NumberInput.Root
						size="xs"
						maxW="120px"
						value={toInputValue(model.fwhm_kms_range[1], 1)}
						step={fwhmStep}
						onValueChange={({ valueAsNumber }) =>
							handleFwhmKmsMaxChange(valueAsNumber)
						}
					>
						<NumberInput.Control />
						<NumberInput.Input onBlur={clampX2OnBlur} />
					</NumberInput.Root>
				</HStack>

				<Text textStyle="xs" color="fg.muted">
					FWHM ≈{" "}
					{waveUnit === "µm"
						? toInputValue(fwhmInUnit, 4)
						: toInputValue(fwhmInUnit, 1)}{" "}
					{waveUnit} ({toInputValue(fwhmVelocity, 1)} km/s)
				</Text>
			</Stack>
		</Stack>
	);
}

interface FitListBoxPanelProps {
	title: string;
	models: FitModel[];
	selectedValues: string[];
	onSelectedValuesChange: (values: string[]) => void;
	contentRef: React.RefObject<HTMLDivElement | null>;
}
function FitListBoxPanel(props: FitListBoxPanelProps) {
	const { title, models, selectedValues, onSelectedValuesChange, contentRef } =
		props;
	const collection = useMemo(() => {
		return createListCollection({
			items: models.map((model) => ({
				id: model.id,
				label: model.name,
				value: model.id.toString(),
				kind: model.kind,
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value,
			groupBy: (item) =>
				item.kind === "linear" ? "Linear Models" : "Gaussian Models",
		});
	}, [models]);
	return (
		<Listbox.Root
			collection={collection}
			selectionMode="multiple"
			value={selectedValues}
			onValueChange={(details) =>
				onSelectedValuesChange(details.value as string[])
			}
		>
			<Listbox.Label>{title}</Listbox.Label>
			<Listbox.Content
				ref={contentRef}
				h="150px"
				overflowY="auto"
				borderWidth="1px"
				borderColor="border.subtle"
				borderRadius="md"
				bg="bg"
			>
				{collection.items.length > 0
					? collection.group().map(([groupLabel, items]) => (
							<Listbox.ItemGroup key={groupLabel}>
								<Listbox.ItemGroupLabel
									p="1"
									fontSize={"xs"}
									color={"fg.muted"}
								>
									{groupLabel}
								</Listbox.ItemGroupLabel>
								{items.map((item) => (
									<Listbox.Item key={item.value} item={item}>
										<Listbox.ItemText>{item.label}</Listbox.ItemText>
										<Listbox.ItemIndicator />
									</Listbox.Item>
								))}
							</Listbox.ItemGroup>
						))
					: null}
			</Listbox.Content>
		</Listbox.Root>
	);
}

function FitModelTransferListBox() {
	const { models, updateModel } = useFitStore(
		useShallow((state) => ({
			models: state.models,
			updateModel: state.updateModel,
		})),
	);

	const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
	const [selectedRight, setSelectedRight] = useState<string[]>([]);

	const leftContentRef = useRef<HTMLDivElement | null>(null);
	const rightContentRef = useRef<HTMLDivElement | null>(null);

	const leftModels = useMemo(
		() => models.filter((model) => !model.subtracted),
		[models],
	);
	const rightModels = useMemo(
		() => models.filter((model) => model.subtracted),
		[models],
	);

	const moveLeftToRight = () => {
		if (selectedLeft.length === 0) return;

		const toMove = leftModels.filter((model) =>
			selectedLeft.includes(model.id.toString()),
		);

		toMove.forEach((model) => {
			updateModel(model.id, { subtracted: true });
		});
		setSelectedLeft([]);
	};
	const moveRightToLeft = () => {
		if (selectedRight.length === 0) return;

		const toMove = rightModels.filter((model) =>
			selectedRight.includes(model.id.toString()),
		);

		toMove.forEach((model) => {
			updateModel(model.id, { subtracted: false });
		});
		setSelectedRight([]);
	};

	return (
		<HStack gap={4} align="center" justify="center">
			<FitListBoxPanel
				title="Model to draw"
				models={leftModels}
				selectedValues={selectedLeft}
				onSelectedValuesChange={setSelectedLeft}
				contentRef={leftContentRef}
			/>
			<Stack gap={2} align="center" justify="center" py={8}>
				<IconButton
					aria-label="Move selected to right"
					size="xs"
					variant="subtle"
					disabled={selectedLeft.length === 0}
					onClick={moveLeftToRight}
				>
					<LuChevronRight />
				</IconButton>
				<IconButton
					aria-label="Move selected to left"
					size="xs"
					variant="subtle"
					disabled={selectedRight.length === 0}
					onClick={moveRightToLeft}
				>
					<LuChevronLeft />
				</IconButton>
			</Stack>
			<FitListBoxPanel
				title="Model to subtract"
				models={rightModels}
				selectedValues={selectedRight}
				onSelectedValuesChange={setSelectedRight}
				contentRef={rightContentRef}
			/>
		</HStack>
	);
}
