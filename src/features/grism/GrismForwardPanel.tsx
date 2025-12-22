"use client";

import {
	Box,
	Button,
	CheckboxCard,
	Heading,
	HStack,
	IconButton,
	Input,
	NumberInput,
	Separator,
	Stack,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useEffect, useId, useMemo, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";

import { Slider } from "@/components/ui/slider";
import { InfoTip } from "@/components/ui/toggle-tip";
import { Tooltip } from "@/components/ui/tooltip";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { useFitStore } from "@/stores/fit";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import { clamp } from "@/utils/projection";
import {
	ANGSTROM_PER_MICRON,
	formatWavelength,
	fromDisplayWavelength,
	toDisplayWavelength,
} from "@/utils/wavelength";

export default function GrismForwardPanel() {
	return (
		<Box
			display="inline-flex"
			flexDirection="column"
			gap={4}
			p={4}
			width={"full"}
			border="1px solid"
			borderRadius="md"
			bg="bg.surface"
		>
			<Stack gap={3}>
				<RedshiftControls />
				<Separator />
				<ExtractionControls />
				<Separator />
				<EmissionLinesManager />
			</Stack>
		</Box>
	);
}

/* -------------------------------------------------------------------------- */
/*                               Redshift controls                            */
/* -------------------------------------------------------------------------- */

function RedshiftControls() {
	const { zRedshift, setZRedshift } = useGrismStore(
		useShallow((state) => ({
			zRedshift: state.zRedshift,
			setZRedshift: state.setZRedshift,
		})),
	);

	const [maxRedshift, setMaxRedshift] = useState(12);
	const [redshiftStep, setRedshiftStep] = useState(0.001);

	const safeMax = Math.max(maxRedshift, 0);
	const sliderZ = clamp(zRedshift, 0, safeMax);
	const sliderValue: number[] = [sliderZ];

	return (
		<Stack gap={3}>
			<Heading size="sm" as="h3">
				Redshift
			</Heading>

			<Slider
				label="z"
				showValue
				min={0}
				max={safeMax}
				step={redshiftStep}
				value={sliderValue}
				thumbAlignment="center"
				onValueChange={({ value }) => {
					const next = clamp(value[0] ?? 0, 0, safeMax);
					setZRedshift(next);
				}}
			/>

			<HStack gap={2} align="center" justify="space-between">
				<Text textStyle="sm" color="fg.muted">
					z = {sliderZ.toFixed(3)}
				</Text>
				<HStack gap={2} align="center">
					<Text textStyle="sm" fontWeight="semibold">
						step
					</Text>
					<NumberInput.Root
						size="sm"
						maxW="80px"
						value={redshiftStep.toString()}
						step={0.001}
						onValueChange={({ valueAsNumber }) => {
							const v =
								Number.isFinite(valueAsNumber) && valueAsNumber > 0
									? valueAsNumber
									: redshiftStep;
							setRedshiftStep(v);
						}}
					>
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>
				<HStack gap={2} align="center">
					<Text textStyle="sm" fontWeight="semibold">
						z max
					</Text>
					<NumberInput.Root
						size="sm"
						maxW="80px"
						value={safeMax.toString()}
						step={0.1}
						onValueChange={({ valueAsNumber }) => {
							const v = Number.isFinite(valueAsNumber)
								? valueAsNumber
								: safeMax;
							const next = Math.max(v, 0);
							setMaxRedshift(next);
						}}
					>
						<NumberInput.Input />
					</NumberInput.Root>
				</HStack>
			</HStack>
		</Stack>
	);
}

/* -------------------------------------------------------------------------- */
/*                      Extraction controls (window + slice)                  */
/* -------------------------------------------------------------------------- */

function ExtractionControls() {
	const switchId = useId();
	const {
		waveUnit,
		collapseWindow,
		setCollapseWindow,
		forwardWaveRange,
		forwardSourcePosition,
		apertureSize,
		slice1DWaveRange,
		setSlice1DWaveRange,
		zRedshift,
		showTraceOnSpectrum2D,
		switchShowTraceOnSpectrum2D,
	} = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			collapseWindow: state.collapseWindow,
			setCollapseWindow: state.setCollapseWindow,
			forwardWaveRange: state.forwardWaveRange,
			forwardSourcePosition: state.forwardSourcePosition,
			apertureSize: state.apertureSize,
			slice1DWaveRange: state.slice1DWaveRange,
			setSlice1DWaveRange: state.setSlice1DWaveRange,
			zRedshift: state.zRedshift,
			showTraceOnSpectrum2D: state.showTraceOnSpectrum2D,
			switchShowTraceOnSpectrum2D: state.switchShowTraceOnSpectrum2D,
		})),
	);

	const { waveFrame } = useFitStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
		})),
	);

	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);

	const { data: extractSpectrumData } = useExtractSpectrum({
		selectedFootprintId,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		x: forwardSourcePosition.x,
		y: forwardSourcePosition.y,
		apertureSize,
		enabled: false,
	});

	const wavelength: number[] = extractSpectrumData?.wavelength ?? [];
	const hasSpectrum = wavelength.length > 0;

	const waveDataMin = hasSpectrum
		? wavelength[0]
		: (collapseWindow.waveMin ?? 0);
	const waveDataMax = hasSpectrum
		? wavelength[wavelength.length - 1]
		: (collapseWindow.waveMax ?? 0);

	const waveRangeMin = Math.min(waveDataMin, waveDataMax);
	const waveRangeMax = Math.max(waveDataMin, waveDataMax);

	const waveMinValue = clamp(
		collapseWindow.waveMin,
		waveRangeMin,
		waveRangeMax,
	);
	const waveMaxValue = clamp(
		collapseWindow.waveMax,
		waveMinValue,
		waveRangeMax,
	);
	const waveSliderValue: number[] = [waveMinValue, waveMaxValue];

	const rows = extractSpectrumData?.spectrum_2d?.length ?? 0;
	const spatialMaxIndex =
		rows > 0 ? rows - 1 : Math.max(collapseWindow.spatialMax, 0);

	const spatialMinValue = clamp(collapseWindow.spatialMin, 0, spatialMaxIndex);
	const spatialMaxValue = clamp(
		collapseWindow.spatialMax,
		spatialMinValue,
		spatialMaxIndex,
	);
	const spatialSliderValue: number[] = [spatialMinValue, spatialMaxValue];

	/* ----------------------------- slice1D range ---------------------------- */

	const [sliceInput, setSliceInput] = useState<{ min: string; max: string }>({
		min: "",
		max: "",
	});

	useEffect(() => {
		const minDisplay = toDisplayWavelength(
			slice1DWaveRange.min,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		const maxDisplay = toDisplayWavelength(
			slice1DWaveRange.max,
			waveUnit,
			waveFrame,
			zRedshift,
		);

		setSliceInput({
			min: Number.isFinite(minDisplay) ? String(minDisplay) : "",
			max: Number.isFinite(maxDisplay) ? String(maxDisplay) : "",
		});
	}, [
		slice1DWaveRange.min,
		slice1DWaveRange.max,
		waveUnit,
		waveFrame,
		zRedshift,
	]);

	const sliceStep = waveUnit === "µm" ? 0.0001 : 1;
	const slicePlaceholderMin = waveUnit === "µm" ? "3.8000" : "38000";
	const slicePlaceholderMax = waveUnit === "µm" ? "5.0000" : "50000";

	const applySliceRange = () => {
		const parsedMin = parseFloat(sliceInput.min);
		const parsedMax = parseFloat(sliceInput.max);

		if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax)) {
			return;
		}

		let minUm = fromDisplayWavelength(
			parsedMin,
			waveUnit,
			waveFrame,
			zRedshift,
		);
		let maxUm = fromDisplayWavelength(
			parsedMax,
			waveUnit,
			waveFrame,
			zRedshift,
		);

		if (minUm > maxUm) {
			const tmp = minUm;
			minUm = maxUm;
			maxUm = tmp;
		}

		const windowMin = Math.min(collapseWindow.waveMin, collapseWindow.waveMax);
		const windowMax = Math.max(collapseWindow.waveMin, collapseWindow.waveMax);

		minUm = clamp(minUm, windowMin, windowMax);
		maxUm = clamp(maxUm, minUm, windowMax);

		setSlice1DWaveRange({ min: minUm, max: maxUm });
	};

	return (
		<Stack gap={3}>
			<HStack justify="space-between" align="center">
				<HStack gap={2} align="center">
					<Heading size="sm" as="h3">
						Extraction Settings
					</Heading>
					<InfoTip content="Run spectrum extraction first so that wavelength and spectrum_2d are available. The controls will be enabled after data is loaded." />
					<Tooltip
						ids={{ trigger: switchId }}
						content={
							showTraceOnSpectrum2D
								? "Hide trace on 2D spectrum"
								: "Show trace on 2D spectrum"
						}
					>
						<Switch.Root
							ids={{ root: switchId }}
							size="sm"
							checked={showTraceOnSpectrum2D}
							onCheckedChange={switchShowTraceOnSpectrum2D}
							colorPalette={"red"}
						>
							<Switch.HiddenInput />
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
						</Switch.Root>
					</Tooltip>
				</HStack>
			</HStack>

			{/* Frame + Unit control */}
			<GrismWavelengthControl />

			{/* Wavelength window */}
			<Stack gap={2}>
				<Text textStyle="sm" color="fg.muted">
					Wavelength window
				</Text>

				<Slider
					min={waveRangeMin}
					max={waveRangeMax}
					step={0.0001}
					value={waveSliderValue}
					disabled={!hasSpectrum}
					minStepsBetweenThumbs={1}
					onValueChange={({ value }) => {
						if (!hasSpectrum) return;

						const [minRaw, maxRaw] = value;

						const safeMin = clamp(
							minRaw ?? waveDataMin,
							waveRangeMin,
							waveRangeMax,
						);
						const safeMax = clamp(maxRaw ?? waveDataMax, safeMin, waveRangeMax);

						setCollapseWindow({
							waveMin: safeMin,
							waveMax: safeMax,
						});
					}}
				/>

				<HStack justify="space-between">
					<Text textStyle="xs">
						{formatWavelength(waveMinValue, waveUnit, waveFrame, zRedshift)}
					</Text>
					<Text textStyle="xs">
						{formatWavelength(waveMaxValue, waveUnit, waveFrame, zRedshift)}
					</Text>
				</HStack>
			</Stack>

			{/* Spatial window */}
			<Stack gap={2}>
				<Text textStyle="sm" color="fg.muted">
					Spatial window (rows, px)
				</Text>
				<Slider
					min={0}
					max={spatialMaxIndex}
					step={1}
					value={spatialSliderValue}
					disabled={!hasSpectrum}
					minStepsBetweenThumbs={1}
					onValueChange={({ value }) => {
						const [minRaw, maxRaw] = value;

						const safeMin = clamp(minRaw ?? 0, 0, spatialMaxIndex);
						const safeMax = clamp(
							maxRaw ?? spatialMaxIndex,
							safeMin,
							spatialMaxIndex,
						);

						setCollapseWindow({
							spatialMin: safeMin,
							spatialMax: safeMax,
						});
					}}
				/>
				<HStack justify="space-between">
					<Text textStyle="xs">min row: {spatialMinValue}</Text>
					<Text textStyle="xs">max row: {spatialMaxValue}</Text>
				</HStack>
			</Stack>

			{/* 1D slice range */}
			<Stack gap={2}>
				<HStack justify="space-between" align="center">
					<Text textStyle="sm" color="fg.muted">
						1D slice wavelength range
					</Text>
					<Text textStyle="xs" color="fg.muted">
						current:{" "}
						{formatWavelength(
							slice1DWaveRange.min,
							waveUnit,
							waveFrame,
							zRedshift,
						)}{" "}
						–{" "}
						{formatWavelength(
							slice1DWaveRange.max,
							waveUnit,
							waveFrame,
							zRedshift,
						)}
					</Text>
				</HStack>

				<HStack gap={2} align="center">
					<NumberInput.Root
						size="sm"
						maxW="90px"
						value={sliceInput.min}
						step={sliceStep}
						onValueChange={({ value }) =>
							setSliceInput((prev) => ({
								...prev,
								min: value,
							}))
						}
					>
						<NumberInput.Input placeholder={slicePlaceholderMin} />
					</NumberInput.Root>
					<Text textStyle="sm">~</Text>
					<NumberInput.Root
						size="sm"
						maxW="90px"
						value={sliceInput.max}
						step={sliceStep}
						onValueChange={({ value }) =>
							setSliceInput((prev) => ({
								...prev,
								max: value,
							}))
						}
					>
						<NumberInput.Input placeholder={slicePlaceholderMax} />
					</NumberInput.Root>

					<Button size="xs" variant="outline" onClick={applySliceRange}>
						Apply
					</Button>
				</HStack>
			</Stack>
		</Stack>
	);
}

/* -------------------------------------------------------------------------- */
/*                         Emission line list + selection                     */
/* -------------------------------------------------------------------------- */

function EmissionLinesManager() {
	const {
		waveUnit,
		zRedshift,
		emissionLines,
		selectedEmissionLines,
		addEmissionLine,
		removeEmissionLine,
		setSelectedEmissionLines,
	} = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			zRedshift: state.zRedshift,
			emissionLines: state.emissionLines,
			selectedEmissionLines: state.selectedEmissionLines,
			addEmissionLine: state.addEmissionLine,
			removeEmissionLine: state.removeEmissionLine,
			setSelectedEmissionLines: state.setSelectedEmissionLines,
		})),
	);

	const [name, setName] = useState("");
	const [wavelength, setWavelength] = useState("");

	const sortedEntries = useMemo(
		() => Object.entries(emissionLines).sort(([, a], [, b]) => a - b),
		[emissionLines],
	);

	const [selectedNames, setSelectedNames] = useState<string[]>(() =>
		Object.keys(selectedEmissionLines),
	);

	useEffect(() => {
		setSelectedNames(Object.keys(selectedEmissionLines));
	}, [selectedEmissionLines]);

	const stepForInput = waveUnit === "µm" ? 0.0001 : 1;
	const placeholderForInput = waveUnit === "µm" ? "0.6563" : "6563";
	const labelUnitText = waveUnit === "µm" ? "λ (μm)" : "λ (Å)";

	const canAdd =
		name.trim().length > 0 && !Number.isNaN(parseFloat(wavelength));

	const handleAdd = () => {
		if (!canAdd) return;
		const raw = parseFloat(wavelength);
		if (!Number.isFinite(raw)) return;

		// 输入被视为 rest frame，在当前单位下；存储为 µm。
		const wlUm = waveUnit === "µm" ? raw : raw / ANGSTROM_PER_MICRON;

		addEmissionLine(name.trim(), wlUm);
		setName("");
		setWavelength("");
	};

	const updateSelection = (lineName: string, shouldSelect: boolean) => {
		setSelectedNames((prev) => {
			const next = shouldSelect
				? Array.from(new Set([...prev, lineName]))
				: prev.filter((n) => n !== lineName);

			const nextRecord: Record<string, number> = {};
			next.forEach((n) => {
				const wl = emissionLines[n];
				if (typeof wl === "number") {
					nextRecord[n] = wl;
				}
			});

			setSelectedEmissionLines(nextRecord);
			return next;
		});
	};

	const handleRemove = (lineName: string) => {
		removeEmissionLine(lineName);
		// store 会同步 selectedEmissionLines，useEffect 会刷新 selectedNames
	};

	const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);

	const formatRest = (wlUm: number) =>
		waveUnit === "µm"
			? `${wlUm.toFixed(4)} μm`
			: `${(wlUm * ANGSTROM_PER_MICRON).toFixed(1)} Å`;

	const formatObs = (wlUm: number) => {
		const obsUm = wlUm * zFactor;
		return waveUnit === "µm"
			? `${obsUm.toFixed(4)} μm`
			: `${(obsUm * ANGSTROM_PER_MICRON).toFixed(1)} Å`;
	};

	return (
		<Stack gap={3}>
			<Heading size="sm" as="h3">
				Emission Lines
			</Heading>

			{/* Add new emission line */}
			<HStack gap={4} align="center" justify="space-between">
				<HStack gap={2} align="center">
					<Text textStyle="sm" fontWeight="semibold">
						Name
					</Text>
					<Input
						size="sm"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. H⍺"
						maxW="110px"
					/>
				</HStack>

				<HStack gap={2} align="center">
					<Text textStyle="sm" fontWeight="semibold">
						{labelUnitText}
					</Text>
					<NumberInput.Root
						size="sm"
						maxW="90px"
						value={wavelength}
						step={stepForInput}
						onValueChange={({ value }) => setWavelength(value)}
					>
						<NumberInput.Input placeholder={placeholderForInput} />
					</NumberInput.Root>
				</HStack>

				<Button
					size="sm"
					variant="outline"
					onClick={handleAdd}
					disabled={!canAdd}
				>
					Add
				</Button>
			</HStack>

			{/* Emission line list - 使用 CheckboxCard 作为多选卡片 */}
			<Stack
				gap={1}
				maxH="180px"
				overflowY="auto"
				borderWidth="1px"
				borderRadius="md"
				borderColor="border.subtle"
				p={2}
				bg="bg.subtle"
			>
				{sortedEntries.length === 0 ? (
					<Text textStyle="sm" color="fg.muted">
						No emission lines yet.
					</Text>
				) : (
					sortedEntries.map(([lineName, wl]) => {
						const isSelected = selectedNames.includes(lineName);
						return (
							<HStack key={lineName} align="center" gap={2} w="full">
								<CheckboxCard.Root
									size="sm"
									value={lineName}
									flex="1"
									checked={isSelected}
									colorPalette="teal"
									onCheckedChange={({ checked }) => {
										const shouldSelect = checked === true;
										updateSelection(lineName, shouldSelect);
									}}
								>
									<CheckboxCard.HiddenInput />
									<CheckboxCard.Control>
										<CheckboxCard.Content>
											<CheckboxCard.Label>{lineName}</CheckboxCard.Label>
											<CheckboxCard.Description>
												<Text textStyle="xs">
													rest: {formatRest(wl)} · obs: {formatObs(wl)}
												</Text>
											</CheckboxCard.Description>
										</CheckboxCard.Content>
										<CheckboxCard.Indicator />
									</CheckboxCard.Control>
								</CheckboxCard.Root>

								{/* 删除按钮与 CheckboxCard 同级，避免 button 嵌套 button */}
								<IconButton
									aria-label="Remove emission line"
									size="xs"
									variant="ghost"
									onClick={() => handleRemove(lineName)}
								>
									<LuTrash2 />
								</IconButton>
							</HStack>
						);
					})
				)}
			</Stack>
		</Stack>
	);
}
