import { Button, HStack, Stack, Switch, Text, useSlotRecipe } from "@chakra-ui/react";
import { useId } from "react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { Slider } from "@/components/ui/slider";
import { Tooltip } from "@/components/ui/tooltip";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import { SectionHeader } from "./components/SectionHeader";
import { useExtractionControls } from "./hooks/useExtractionControls";
import { extractionControlsRecipe } from "./recipes/extraction-controls.recipe";

export default function ExtractionControls() {
	const switchId = useId();
	const {
		localWaveRange,
		localSpatialRange,
		dataLimits,
		hasSpectrum,
		waveUnit,
		formatterWithUnit,
		showTraceOnSpectrum2D,
		switchShowTraceOnSpectrum2D,
		handleWaveSliderChange,
		handleSpatialSliderChange,
		handleSliceContainerKeyDown,
		sliceManager,
	} = useExtractionControls();

	const recipe = useSlotRecipe({ recipe: extractionControlsRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<SectionHeader
				title="Extraction"
				tip="Adjust the extraction window (2D) and slice range (1D)."
				leftSlot={<GrismWavelengthControl />}
				rightSlot={
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
							<Switch.Control css={styles.switchControl}>
								<Switch.Thumb />
							</Switch.Control>
						</Switch.Root>
					</Tooltip>
				}
			/>

			<Stack
				css={styles.sliderGroup}
				opacity={hasSpectrum ? 1 : 0.6}
				pointerEvents={hasSpectrum ? "auto" : "none"}
			>
				<Stack gap={2}>
					<HStack css={styles.rangeRow}>
						<Text css={styles.label}>Wavelength Window</Text>
						<HStack gap={1}>
							<Text css={styles.valuePill}>
								{formatterWithUnit(localWaveRange[0])}
							</Text>
							<Text textStyle="xs" color="fg.subtle">
								–
							</Text>
							<Text css={styles.valuePill}>
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

				<Stack gap={2}>
					<HStack css={styles.rangeRow}>
						<Text css={styles.label}>Spatial Window (Rows)</Text>
						<HStack gap={1}>
							<Text css={styles.valuePill}>{localSpatialRange[0]}</Text>
							<Text textStyle="xs" color="fg.subtle">
								–
							</Text>
							<Text css={styles.valuePill}>{localSpatialRange[1]}</Text>
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

			<Stack gap={2}>
				<Text css={styles.label}>1D Slice Wavelength Range ({waveUnit})</Text>

				<HStack
					css={styles.sliceRow}
					align="flex-end"
					onKeyDown={handleSliceContainerKeyDown}
				>
					<CompactNumberInput
						label="MIN"
						value={sliceManager.minValue}
						onChange={sliceManager.setMin}
						labelPos="top"
						inputWidth="full"
					/>

					<Text css={styles.sliceDivider}>~</Text>

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
