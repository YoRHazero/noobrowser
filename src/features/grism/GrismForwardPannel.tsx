"use client";

import {
    Box,
    Button,
    IconButton,
    Heading,
    HStack,
    Input,
    NumberInput,
    SegmentGroup,
    Separator,
    Stack,
    Text,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { Slider } from "@/components/ui/slider";
import { useGrismStore, useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { clamp } from "@/utils/projection";
import { InfoTip } from "@/components/ui/toggle-tip";

const ANGSTROM_PER_MICRON = 1e4;

type WaveUnit = "µm" | "Å";

export default function GrismForwardPanel() {
    return (
        <Box display="inline-flex" flexDirection="column" gap={4} p={4} width={"450px"} border="1px solid" borderRadius="md" bg="bg.surface">
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

    // Local config used only in this panel
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
    const {
        waveUnit,
        setWaveUnit,
        collapseWindow,
        setCollapseWindow,
        forwardWaveRange,
        apertureSize,
        slice1DWaveRange,
        setSlice1DWaveRange,
    } = useGrismStore(
        useShallow((state) => ({
            waveUnit: state.waveUnit,
            setWaveUnit: state.setWaveUnit,
            collapseWindow: state.collapseWindow,
            setCollapseWindow: state.setCollapseWindow,
            forwardWaveRange: state.forwardWaveRange,
            apertureSize: state.apertureSize,
            slice1DWaveRange: state.slice1DWaveRange,
            setSlice1DWaveRange: state.setSlice1DWaveRange,
        })),
    );

    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const selectedFootprintId = useGlobeStore(
        (state) => state.selectedFootprintId,
    );

    const { data: extractSpectrumData } = useExtractSpectrum({
        selectedFootprintId,
        waveMin: forwardWaveRange.min,
        waveMax: forwardWaveRange.max,
        cutoutParams,
        apertureSize,
        enabled: false,
    });

    const wavelength: number[] = extractSpectrumData?.wavelength ?? [];
    const hasSpectrum = wavelength.length > 0;

    const waveDataMin = hasSpectrum
        ? wavelength[0]
        : collapseWindow.waveMin ?? 0;
    const waveDataMax = hasSpectrum
        ? wavelength[wavelength.length - 1]
        : collapseWindow.waveMax ?? 0;

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

    const spatialMinValue = clamp(
        collapseWindow.spatialMin,
        0,
        spatialMaxIndex,
    );
    const spatialMaxValue = clamp(
        collapseWindow.spatialMax,
        spatialMinValue,
        spatialMaxIndex,
    );
    const spatialSliderValue: number[] = [spatialMinValue, spatialMaxValue];

    const formatWave = (vUm: number) =>
        waveUnit === "µm"
            ? `${vUm.toFixed(4)} μm`
            : `${Math.round(vUm * ANGSTROM_PER_MICRON)} Å`;

    /* ----------------------------- slice1D range ---------------------------- */

    const [sliceInput, setSliceInput] = useState<{ min: string; max: string }>({
        min: "",
        max: "",
    });

    // Sync local slice input from store and wave unit.
    useEffect(() => {
        const minDisplay =
            waveUnit === "µm"
                ? slice1DWaveRange.min
                : slice1DWaveRange.min * ANGSTROM_PER_MICRON;
        const maxDisplay =
            waveUnit === "µm"
                ? slice1DWaveRange.max
                : slice1DWaveRange.max * ANGSTROM_PER_MICRON;

        setSliceInput({
            min: Number.isFinite(minDisplay) ? String(minDisplay) : "",
            max: Number.isFinite(maxDisplay) ? String(maxDisplay) : "",
        });
    }, [slice1DWaveRange.min, slice1DWaveRange.max, waveUnit]);

    const sliceStep = waveUnit === "µm" ? 0.0001 : 1;
    const slicePlaceholderMin =
        waveUnit === "µm" ? "3.8000" : "38000";
    const slicePlaceholderMax =
        waveUnit === "µm" ? "5.0000" : "50000";

    const applySliceRange = () => {
        const parsedMin = parseFloat(sliceInput.min);
        const parsedMax = parseFloat(sliceInput.max);

        if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax)) {
            return;
        }

        // Convert from display unit to µm
        let minUm =
            waveUnit === "µm"
                ? parsedMin
                : parsedMin / ANGSTROM_PER_MICRON;
        let maxUm =
            waveUnit === "µm"
                ? parsedMax
                : parsedMax / ANGSTROM_PER_MICRON;

        // Ensure min <= max
        if (minUm > maxUm) {
            const tmp = minUm;
            minUm = maxUm;
            maxUm = tmp;
        }

        const windowMin = Math.min(
            collapseWindow.waveMin,
            collapseWindow.waveMax,
        );
        const windowMax = Math.max(
            collapseWindow.waveMin,
            collapseWindow.waveMax,
        );

        // Clamp inside collapseWindow
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
                </HStack>

                {/* Global wavelength unit segmented control */}
                <SegmentGroup.Root
                    size="xs"
                    value={waveUnit}
                    onValueChange={(e) => {
                        const next = e.value as WaveUnit | null;
                        if (next === "µm" || next === "Å") {
                            setWaveUnit(next);
                        }
                    }}
                >
                    <SegmentGroup.Items items={["µm", "Å"]} />
                    <SegmentGroup.Indicator />
                </SegmentGroup.Root>
            </HStack>

            {/* Wavelength window (µm / Å) */}
            <Stack gap={2}>
                <Text textStyle="sm" color="fg.muted">
                    Wavelength window
                </Text>

                <Slider
                    min={waveRangeMin}
                    max={waveRangeMax}
                    // 1 Å step in µm
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
                        const safeMax = clamp(
                            maxRaw ?? waveDataMax,
                            safeMin,
                            waveRangeMax,
                        );

                        // Always store in µm
                        setCollapseWindow({
                            waveMin: safeMin,
                            waveMax: safeMax,
                        });
                    }}
                />

                <HStack justify="space-between">
                    <Text textStyle="xs">{formatWave(waveMinValue)}</Text>
                    <Text textStyle="xs">{formatWave(waveMaxValue)}</Text>
                </HStack>
            </Stack>

            {/* Spatial window (integer rows) */}
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

            {/* 1D slice range (within collapseWindow) */}
            <Stack gap={2}>
                <HStack justify="space-between" align="center">
                    <Text textStyle="sm" color="fg.muted">
                        1D slice wavelength range
                    </Text>
                    <Text textStyle="xs" color="fg.muted">
                        current: {formatWave(slice1DWaveRange.min)} –{" "}
                        {formatWave(slice1DWaveRange.max)}
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
                        <NumberInput.Input
                            placeholder={slicePlaceholderMin}
                        />
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
                        <NumberInput.Input
                            placeholder={slicePlaceholderMax}
                        />
                    </NumberInput.Root>

                    <Button
                        size="xs"
                        variant="outline"
                        onClick={applySliceRange}
                    >
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
        emissionLines,
        selectedEmissionLines,
        addEmissionLine,
        removeEmissionLine,
        setSelectedEmissionLines,
    } = useGrismStore(
        useShallow((state) => ({
            waveUnit: state.waveUnit,
            emissionLines: state.emissionLines,
            selectedEmissionLines: state.selectedEmissionLines,
            addEmissionLine: state.addEmissionLine,
            removeEmissionLine: state.removeEmissionLine,
            setSelectedEmissionLines: state.setSelectedEmissionLines,
        })),
    );

    const [name, setName] = useState("");
    const [wavelength, setWavelength] = useState("");

    // Sort lines by wavelength ascending for UI presentation
    const sortedEntries = useMemo(
        () => Object.entries(emissionLines).sort(([, a], [, b]) => a - b),
        [emissionLines],
    );

    const [selectedNames, setSelectedNames] = useState<string[]>(() =>
        Object.keys(selectedEmissionLines),
    );

    // Keep local selection in sync with store updates
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

        // Convert to µm before storing
        const wlUm =
            waveUnit === "µm" ? raw : raw / ANGSTROM_PER_MICRON;

        addEmissionLine(name.trim(), wlUm);
        setName("");
        setWavelength("");
    };

    const toggleSelect = (lineName: string) => {
        setSelectedNames((prev) => {
            const exists = prev.includes(lineName);
            const next = exists
                ? prev.filter((n) => n !== lineName)
                : [...prev, lineName];

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
        // selectedEmissionLines will be updated in the store;
        // useEffect will sync selectedNames from it.
    };

    const formatLineWave = (wlUm: number) =>
        waveUnit === "µm"
            ? `${wlUm.toFixed(4)} μm`
            : `${(wlUm * ANGSTROM_PER_MICRON).toFixed(1)} Å`;

    return (
        <Stack gap={3}>
            <Heading size="sm" as="h3">
                Emission Lines
            </Heading>

            {/* Add new emission line (input follows unit, store always µm) */}
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

            {/* Emission line list with multi-select + delete */}
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
                            <Button
                                key={lineName}
                                size="xs"
                                variant={isSelected ? "solid" : "surface"}
                                colorPalette={isSelected ? "teal" : "gray"}
                                justifyContent="space-between"
                                onClick={() => toggleSelect(lineName)}
                            >
                                <HStack
                                    justify="space-between"
                                    w="full"
                                    align="center"
                                >
                                    <Text textStyle="xs" fontWeight="medium">
                                        {lineName}
                                    </Text>
                                    <HStack gap={1} align="center">
                                        <Text textStyle="xs" color="fg.muted">
                                            {formatLineWave(wl)}
                                        </Text>
                                        <IconButton
                                            aria-label="Remove emission line"
                                            size="xs"
                                            variant="ghost"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleRemove(lineName);
                                            }}
                                        >
                                            <LuX />
                                        </IconButton>
                                    </HStack>
                                </HStack>
                            </Button>
                        );
                    })
                )}
            </Stack>
        </Stack>
    );
}
