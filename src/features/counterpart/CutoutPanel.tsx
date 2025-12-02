"use client";

import {
	Box,
	Button,
	Field,
	Heading,
	HStack,
	NumberInput,
	Separator,
	Stack,
	Switch,
	Text,
} from "@chakra-ui/react";
import { useEffect, useId, useState } from "react";
import { useImmer } from "use-immer";
import { useShallow } from "zustand/react/shallow";
import { NormPercentageInput } from "@/components/ui/custom-component";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import {
	useCounterpartCutout,
	useExtractSpectrum,
	useWorldCoordinates,
} from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import type { CutoutParams } from "@/stores/stores-types.js";
import { clamp } from "@/utils/projection";

export default function CutoutPanel() {
	return (
		<Box display="inline-flex" flexDirection="column" gap={4} p={4}>
			<Stack gap={3}>
				<NormalizationParameters />
				<Separator />
				<CutoutPosition />
				<Separator />
				<ExtractionParameters />
			</Stack>
		</Box>
	);
}

function NormalizationParameters() {
	const { cutoutParams, setCutoutParams } = useCounterpartStore(
		useShallow((state) => ({
			cutoutParams: state.cutoutParams,
			setCutoutParams: state.setCutoutParams,
		})),
	);

	const handleCutoutPminChange = (next: number) => {
		const maxAllowedCutoutPmin = cutoutParams.cutoutPmax - 5;
		const clampedValue = clamp(next, 0, maxAllowedCutoutPmin);
		setCutoutParams({ cutoutPmin: clampedValue });
	};
	const handleCutoutPmaxChange = (next: number) => {
		const minAllowedCutoutPmax = cutoutParams.cutoutPmin + 5;
		const clampedValue = clamp(next, minAllowedCutoutPmax, 100);
		setCutoutParams({ cutoutPmax: clampedValue });
	};

	return (
		<Stack gap={3}>
			<Heading size="sm" as="h3">
				Normalization Parameters
			</Heading>
			<HStack gap={4}>
				<NormPercentageInput
					label="Pmin (%)"
					value={cutoutParams.cutoutPmin}
					onValueChange={handleCutoutPminChange}
					width="80px"
				/>
				<NormPercentageInput
					label="Pmax (%)"
					value={cutoutParams.cutoutPmax}
					onValueChange={handleCutoutPmaxChange}
					width="80px"
				/>
			</HStack>
		</Stack>
	);
}

function CutoutPosition() {
	const {
		cutoutParams,
		setCutoutParams,
		showCutout,
		setShowCutout,
		filterRGB,
	} = useCounterpartStore(
		useShallow((state) => ({
			cutoutParams: state.cutoutParams,
			setCutoutParams: state.setCutoutParams,
			showCutout: state.showCutout,
			setShowCutout: state.setShowCutout,
			filterRGB: state.filterRGB,
		})),
	);

	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const switchId = useId();
	const confirmId = useId();
	const retrieveId = useId();

	const [cutoutParamsInput, setCutoutParamsInput] =
		useImmer<CutoutParams>(cutoutParams);
	const [isDirty, setIsDirty] = useState(false);

	useEffect(() => {
		if (!isDirty) {
			setCutoutParamsInput(cutoutParams);
		}
	}, [cutoutParams, isDirty, setCutoutParamsInput]);

	const onConfirm = () => {
		setCutoutParams(cutoutParamsInput);
		setIsDirty(false);
	};

	const { refetch: refetchCutout, isFetching: isFetchingCutout } =
		useCounterpartCutout({
			selectedFootprintId,
			filter: filterRGB.r,
			cutoutParams,
			enabled: false,
		});
	const onRetrieveCutout = () => {
		if (!selectedFootprintId || !filterRGB.r) {
			toaster.error({
				title: "Cannot retrieve cutout",
				description: "Please select a footprint and filter first.",
			});
			return;
		}
		if (isDirty) {
			toaster.error({
				title: "Unsaved changes",
				description:
					"Please confirm cutout position changes before retrieving cutout.",
			});
			return;
		}
		refetchCutout();
	};

	const { data: worldCoordinates, isSuccess: isWorldCoordinatesSuccess } =
		useWorldCoordinates({
			selectedFootprintId,
			cutoutParams,
			enabled: true,
		});

	const handleFieldChange =
		(key: keyof CutoutParams) =>
		({ valueAsNumber }: { valueAsNumber: number }) => {
			setCutoutParamsInput((draft) => {
				draft[key] = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber;
			});
			setIsDirty(true);
		};
	const positionFields: Array<{ label: string; key: keyof CutoutParams }> = [
		{ label: "x0", key: "x0" },
		{ label: "y0", key: "y0" },
		{ label: "width", key: "width" },
		{ label: "height", key: "height" },
	];
	return (
		<Stack gap={3}>
			<HStack gap={2} justify={"space-between"}>
				<Heading size="sm" as="h3">
					Cutout Position
				</Heading>
				<Tooltip
					ids={{ trigger: switchId }}
					content="Show cutout region on the counterpart image"
				>
					<Switch.Root
						size="md"
						ids={{ root: switchId }}
						checked={showCutout}
						onCheckedChange={(e) => setShowCutout(e.checked)}
					>
						<Switch.HiddenInput />
						<Switch.Control />
						<Switch.Label>{showCutout ? "show" : "hide"}</Switch.Label>
					</Switch.Root>
				</Tooltip>
			</HStack>
			<HStack gap={2}>
				{positionFields.map(({ label, key }) => (
					<Field.Root
						key={key}
						orientation={"horizontal"}
						css={{ "--field-label-width": "15px" }}
					>
						<Field.Label>{label}</Field.Label>
						<NumberInput.Root
							size="sm"
							maxW="60px"
							value={cutoutParamsInput[key].toString()}
							onValueChange={handleFieldChange(key)}
						>
							<NumberInput.Input placeholder={cutoutParams[key].toString()} />
						</NumberInput.Root>
					</Field.Root>
				))}
			</HStack>
			<HStack justify={"space-between"}>
				<Text textStyle="sm">
					RA:{" "}
					{isWorldCoordinatesSuccess
						? `${worldCoordinates.ra.toFixed(6)}°`
						: "--"}
					{isWorldCoordinatesSuccess ? ` [${worldCoordinates.ra_hms}]` : ""}
				</Text>
				<Text textStyle="sm">
					Dec:{" "}
					{isWorldCoordinatesSuccess
						? `${worldCoordinates.dec.toFixed(6)}°`
						: "--"}
					{isWorldCoordinatesSuccess ? ` [${worldCoordinates.dec_dms}]` : ""}
				</Text>
			</HStack>
			<HStack justify={"flex-end"}>
				<Tooltip
					ids={{ trigger: confirmId }}
					content="Confirm changes to cutout position"
				>
					<Button
						size="sm"
						onClick={onConfirm}
						variant="outline"
						disabled={!isDirty}
					>
						Confirm
					</Button>
				</Tooltip>
				<Tooltip
					ids={{ trigger: retrieveId }}
					content="Retrieve cutout with current settings"
				>
					<Button
						size="sm"
						onClick={onRetrieveCutout}
						variant="solid"
						loading={isFetchingCutout}
					>
						Cutout
					</Button>
				</Tooltip>
			</HStack>
		</Stack>
	);
}

function ExtractionParameters() {
	const {
		apertureSize,
		setApertureSize,
		forwardWaveRange,
		setForwardWaveRange,
		setCollapseWindow,
	} = useGrismStore(
		useShallow((state) => ({
			apertureSize: state.apertureSize,
			setApertureSize: state.setApertureSize,
			forwardWaveRange: state.forwardWaveRange,
			setForwardWaveRange: state.setForwardWaveRange,
			setCollapseWindow: state.setCollapseWindow,
		})),
	);
	const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);

	const extractId = useId();
	const {
		refetch: refetchExtractSpectrum,
		isFetching: isFetchingExtractSpectrum,
		data: extractSpectrumData,
	} = useExtractSpectrum({
		selectedFootprintId,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
		cutoutParams,
		apertureSize,
		enabled: false,
	});
	const onRetrieveExtractSpectrum = () => {
		toaster.info({
			title: `Extracting spectrum at (${cutoutParams.x0 + cutoutParams.width / 2}, ${cutoutParams.y0 + cutoutParams.height / 2})`,
			description: `Wavelength: ${forwardWaveRange.min} - ${forwardWaveRange.max} μm, Aperture Size: ${apertureSize} px`,
		});
		refetchExtractSpectrum();
	};

	useEffect(() => {
		if (extractSpectrumData) {
			if (extractSpectrumData.covered) {
				const waveArray = extractSpectrumData.wavelength;
				const spectrum2D = extractSpectrumData.spectrum_2d;
				setCollapseWindow({
					waveMin: waveArray[0],
					waveMax: waveArray[waveArray.length - 1],
					spatialMin: 0,
					spatialMax: spectrum2D.length - 1,
				});
				queueMicrotask(() => {
					toaster.success({
						title: "Extracted spectrum retrieved",
					});
				});
			} else {
				queueMicrotask(() => {
					toaster.warning({
						title: "No spectrum available",
						description: "No spectrum is available at the selected position.",
					});
				});
			}
		}
	}, [extractSpectrumData, setCollapseWindow]);
	return (
		<Stack gap={3}>
			<Heading size="sm" as="h3">
				Extraction Parameters
			</Heading>
			<HStack gap={3}>
				<Text textStyle="sm">Aperture Size:</Text>
				<NumberInput.Root
					size="sm"
					maxW="60px"
					value={apertureSize.toString()}
					onValueChange={({ valueAsNumber }) => {
						setApertureSize(valueAsNumber);
					}}
				>
					<NumberInput.Input placeholder={apertureSize.toString()} />
				</NumberInput.Root>
				<Text textStyle="sm">Wave (μm):</Text>
				<NumberInput.Root
					size="sm"
					maxW="60px"
					value={forwardWaveRange.min.toString()}
					onValueChange={({ valueAsNumber }) => {
						setForwardWaveRange({ min: valueAsNumber });
					}}
				>
					<NumberInput.Input placeholder={forwardWaveRange.min.toString()} />
				</NumberInput.Root>
				<Text textStyle="sm">~</Text>
				<NumberInput.Root
					size="sm"
					maxW="60px"
					value={forwardWaveRange.max.toString()}
					onValueChange={({ valueAsNumber }) => {
						setForwardWaveRange({ max: valueAsNumber });
					}}
				>
					<NumberInput.Input placeholder={forwardWaveRange.max.toString()} />
				</NumberInput.Root>
			</HStack>
			<HStack gap={3} justify={"flex-end"}>
				<Tooltip
					ids={{ trigger: extractId }}
					content="Retrieve extracted spectrum with settings after last confirmation"
				>
					<Button
						size="sm"
						onClick={onRetrieveExtractSpectrum}
						variant="solid"
						loading={isFetchingExtractSpectrum}
					>
						Extract
					</Button>
				</Tooltip>
			</HStack>
		</Stack>
	);
}
