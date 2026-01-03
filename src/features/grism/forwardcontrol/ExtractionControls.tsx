import { Button, Heading, HStack, Stack, Switch, Text } from "@chakra-ui/react";
import { useEffect, useId, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { Slider } from "@/components/ui/slider";
import { InfoTip } from "@/components/ui/toggle-tip";
import { Tooltip } from "@/components/ui/tooltip";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";

import { useExtractSpectrum } from "@/hook/connection-hook";
import {
	useSliceRangeManager,
	useWavelengthDisplay,
} from "@/hook/wavelength-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useGrismStore } from "@/stores/image";
import { clamp } from "@/utils/projection";

// --- Theme Constants ---
const THEME_STYLES = {
	heading: {
		size: "sm" as const,
		letterSpacing: "wide",
		fontWeight: "extrabold",
		textTransform: "uppercase" as const,
		color: { base: "gray.700", _dark: "transparent" },
		bgGradient: { base: "none", _dark: "to-r" },
		gradientFrom: { _dark: "cyan.400" },
		gradientTo: { _dark: "purple.500" },
		bgClip: { base: "border-box", _dark: "text" },
	},
	label: {
		textStyle: "2xs",
		color: "fg.muted",
		fontWeight: "bold",
		textTransform: "uppercase" as const,
		letterSpacing: "wider",
	},
	valueDisplay: {
		textStyle: "xs",
		fontFamily: "mono",
		px: 1.5,
		py: 0.5,
		borderRadius: "sm",
		borderWidth: "1px",
		bg: { base: "cyan.50", _dark: "blackAlpha.400" },
		color: { base: "cyan.800", _dark: "cyan.300" },
		borderColor: { base: "cyan.200", _dark: "transparent" },
		fontWeight: { base: "medium", _dark: "normal" },
	},
	switchControl: {
		// 1. 默认状态 (OFF): 灰色/半透明背景
		bg: { base: "gray.300", _dark: "whiteAlpha.200" },
		borderColor: { base: "gray.400", _dark: "whiteAlpha.100" },
		transition: "all 0.2s",

		// 2. 激活状态 (ON): 显式覆盖背景色为青色
		_checked: {
			bg: { base: "cyan.500", _dark: "cyan.600" },
			borderColor: { base: "cyan.600", _dark: "cyan.400" },
			// 在暗黑模式下加一点微光
			boxShadow: { _dark: "0 0 10px rgba(0, 200, 255, 0.3)" },
		},
	},
};

export default function ExtractionControls() {
	const switchId = useId();

	const {
		collapseWindow,
		setCollapseWindow,
		forwardWaveRange,
		forwardSourcePosition,
		apertureSize,
		showTraceOnSpectrum2D,
		switchShowTraceOnSpectrum2D,
	} = useGrismStore(
		useShallow((state) => ({
			collapseWindow: state.collapseWindow,
			setCollapseWindow: state.setCollapseWindow,
			forwardWaveRange: state.forwardWaveRange,
			forwardSourcePosition: state.forwardSourcePosition,
			apertureSize: state.apertureSize,
			showTraceOnSpectrum2D: state.showTraceOnSpectrum2D,
			switchShowTraceOnSpectrum2D: state.switchShowTraceOnSpectrum2D,
		})),
	);

	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const sliceManager = useSliceRangeManager();
	const { formatterWithUnit, waveUnit } = useWavelengthDisplay();

	const { data: extractSpectrumData } = useExtractSpectrum({
		selectedFootprintId,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		x: forwardSourcePosition.x,
		y: forwardSourcePosition.y,
		apertureSize,
		enabled: false,
	});

	const wavelength = extractSpectrumData?.wavelength ?? [];
	const hasSpectrum = wavelength.length > 0;

	const dataLimits = useMemo(() => {
		if (!hasSpectrum) {
			return {
				waveMin: collapseWindow.waveMin ?? 0,
				waveMax: collapseWindow.waveMax ?? 0,
				spatialMax: Math.max(collapseWindow.spatialMax, 0),
			};
		}
		const wMin = wavelength[0];
		const wMax = wavelength[wavelength.length - 1];
		const rows = extractSpectrumData?.spectrum_2d?.length ?? 0;

		return {
			waveMin: Math.min(wMin, wMax),
			waveMax: Math.max(wMin, wMax),
			spatialMax: rows > 0 ? rows - 1 : 0,
		};
	}, [
		hasSpectrum,
		wavelength,
		extractSpectrumData?.spectrum_2d,
		collapseWindow,
	]);

	const [localWaveRange, setLocalWaveRange] = useState([
		collapseWindow.waveMin,
		collapseWindow.waveMax,
	]);
	const [localSpatialRange, setLocalSpatialRange] = useState([
		collapseWindow.spatialMin,
		collapseWindow.spatialMax,
	]);

	useEffect(() => {
		setLocalWaveRange([collapseWindow.waveMin, collapseWindow.waveMax]);
		setLocalSpatialRange([
			collapseWindow.spatialMin,
			collapseWindow.spatialMax,
		]);
	}, [collapseWindow]);

	const debouncedSetCollapseWindow = useDebouncedCallback(
		(updates: Partial<typeof collapseWindow>) => setCollapseWindow(updates),
		20,
	);

	const handleWaveSliderChange = ({ value }: { value: number[] }) => {
		if (!hasSpectrum) return;
		const [minRaw, maxRaw] = value;
		const safeMin = clamp(minRaw, dataLimits.waveMin, dataLimits.waveMax);
		const safeMax = clamp(maxRaw, safeMin, dataLimits.waveMax);
		setLocalWaveRange([safeMin, safeMax]);
		debouncedSetCollapseWindow({ waveMin: safeMin, waveMax: safeMax });
	};

	const handleSpatialSliderChange = ({ value }: { value: number[] }) => {
		if (!hasSpectrum) return;
		const [minRaw, maxRaw] = value;
		const safeMin = clamp(minRaw, 0, dataLimits.spatialMax);
		const safeMax = clamp(maxRaw, safeMin, dataLimits.spatialMax);
		setLocalSpatialRange([safeMin, safeMax]);
		debouncedSetCollapseWindow({ spatialMin: safeMin, spatialMax: safeMax });
	};

	const handleSliceContainerKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") sliceManager.applyRange();
	};

	return (
		<Stack gap={4}>
			{/* Header */}
			<HStack justify="space-between" align="center">
				<HStack gap={2} align="center">
					<Heading {...THEME_STYLES.heading}>Extraction</Heading>
					<InfoTip content="Adjust the extraction window (2D) and slice range (1D)." />
					<GrismWavelengthControl />
				</HStack>

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
						colorPalette="cyan"
					>
						<Switch.HiddenInput />
						<Switch.Control {...THEME_STYLES.switchControl}>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</Tooltip>
			</HStack>

			{/* Sliders Container */}
			<Stack
				gap={5}
				opacity={hasSpectrum ? 1 : 0.6}
				pointerEvents={hasSpectrum ? "auto" : "none"}
				transition="opacity 0.2s"
			>
				{/* Wavelength Window */}
				<Stack gap={2}>
					<HStack justify="space-between">
						<Text {...THEME_STYLES.label}>Wavelength Window</Text>
						<HStack gap={1}>
							<Text {...THEME_STYLES.valueDisplay}>
								{formatterWithUnit(localWaveRange[0])}
							</Text>
							<Text textStyle="xs" color="fg.subtle">
								–
							</Text>
							<Text {...THEME_STYLES.valueDisplay}>
								{formatterWithUnit(localWaveRange[1])}
							</Text>
						</HStack>
					</HStack>

					<Slider
						min={dataLimits.waveMin}
						max={dataLimits.waveMax}
						step={0.0001}
						value={localWaveRange}
						disabled={!hasSpectrum}
						minStepsBetweenThumbs={1}
						onValueChange={handleWaveSliderChange}
						colorPalette="cyan"
					/>
				</Stack>

				{/* Spatial Window */}
				<Stack gap={2}>
					<HStack justify="space-between">
						<Text {...THEME_STYLES.label}>Spatial Window (Rows)</Text>
						<HStack gap={1}>
							<Text {...THEME_STYLES.valueDisplay}>{localSpatialRange[0]}</Text>
							<Text textStyle="xs" color="fg.subtle">
								–
							</Text>
							<Text {...THEME_STYLES.valueDisplay}>{localSpatialRange[1]}</Text>
						</HStack>
					</HStack>
					<Slider
						min={0}
						max={dataLimits.spatialMax}
						step={1}
						value={localSpatialRange}
						disabled={!hasSpectrum}
						minStepsBetweenThumbs={1}
						onValueChange={handleSpatialSliderChange}
						colorPalette="purple"
					/>
				</Stack>
			</Stack>

			{/* Slice 1D Inputs */}
			<Stack gap={2}>
				<Text {...THEME_STYLES.label}>
					1D Slice Wavelength Range ({waveUnit})
				</Text>

				<HStack gap={3} align="end" onKeyDown={handleSliceContainerKeyDown}>
					<CompactNumberInput
						label="MIN"
						value={sliceManager.minValue}
						onChange={sliceManager.setMin}
						labelPos="top"
						inputWidth="full"
					/>

					<Text pb={1.5} color="fg.subtle" opacity={0.5}>
						~
					</Text>

					<CompactNumberInput
						label="MAX"
						value={sliceManager.maxValue}
						onChange={sliceManager.setMax}
						labelPos="top"
						inputWidth="full"
					/>

					<Button
						size="xs"
						variant="surface"
						onClick={sliceManager.applyRange}
						mb={0.5}
						minW="50px"
						colorPalette="cyan"
					>
						APPLY
					</Button>
				</HStack>
			</Stack>
		</Stack>
	);
}
