"use client";

import {
    Box,
    Button,
    Stack,
    Heading,
    HStack,
    Separator,
    Switch,
    Text,
    NumberInput,
} from "@chakra-ui/react";
import  { useImmer } from "use-immer";
import { useEffect, useId } from "react";
import { useCounterpartStore, type CutoutParams } from "@/stores/image";
import { clamp } from "@/utils/projection";
import { PercentageInput } from "@/components/ui/custom-component";
import { Tooltip } from "@/components/ui/tooltip";
import { useCounterpartCutout } from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
type CutoutParamsFlags = Partial<{
    [K in keyof CutoutParams]: boolean;
}>;

export default function CutoutPanel() {
    const switchId = useId();
    const { cutoutParams, showCutout, setCutoutParams, setShowCutout } = useCounterpartStore();
    const [cutoutParamsInput, setCutoutParamsInput] = useImmer<CutoutParams>(cutoutParams);
    const [cutoutParamsFlags, setCutoutParamsFlags] = useImmer<CutoutParamsFlags>({
        x0: false,
        y0: false,
        width: false,
        height: false,
    });

    useEffect(() => {
    setCutoutParamsInput(draft => {
        Object.keys(cutoutParamsFlags).forEach((key) => {
            const k = key as keyof CutoutParamsFlags;
            if (!cutoutParamsFlags[k]) {
                draft[k] = cutoutParams[k];
            }
        })
    })}, [cutoutParams, cutoutParamsFlags]); 

    /* normalization parameters */
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
    /* retrieve cutout */
    const filterRGB = useCounterpartStore((s) => s.filterRGB);
    const selectedFootprintId = useGlobeStore((s) => s.selectedFootprintId);
    const { refetch: refetchCutout } = useCounterpartCutout(
        selectedFootprintId,
        filterRGB.r,
        cutoutParams,
        false
    );
    const onRetrieveCutout = () => {
        refetchCutout();
    };

    /* onConfirm cutout position changes */
    const onConfirm = () => {
        setCutoutParams(cutoutParamsInput);
        setCutoutParamsFlags({
            x0: false,
            y0: false,
            width: false,
            height: false,
        });
    }

    return (
        <Box display="inline-flex" flexDirection="column" gap={4} p={4} >
            <Stack gap={3}>
                <Heading size="sm" as='h3'>Normalization Parameters</Heading>
                <HStack gap={4}>
                    <PercentageInput
                        label="Pmin (%)"
                        value={cutoutParamsInput.cutoutPmin}
                        onValueChange={handleCutoutPminChange}
                        width="80px"
                    />
                    <PercentageInput
                        label="Pmax (%)"
                        value={cutoutParamsInput.cutoutPmax}
                        onValueChange={handleCutoutPmaxChange}
                        width="80px"
                    />
                </HStack>
                <Heading size="sm" as='h3'>Cutout Position</Heading>
                <HStack gap={4}>
                    <Text textStyle="sm">x0</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW='60px'
                        value={cutoutParamsInput.x0.toString()}
                        onValueChange={({ valueAsNumber }) => {
                            setCutoutParamsInput(draft => { draft.x0 = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber; });
                            setCutoutParamsFlags(draft => { draft.x0 = true; });
                        }}
                    >
                        <NumberInput.Input placeholder={ cutoutParams.x0.toString() }/>
                    </NumberInput.Root>
                    <Text textStyle="sm">y0</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW='60px'
                        value={cutoutParamsInput.y0.toString()}
                        onValueChange={({ valueAsNumber }) => {
                            setCutoutParamsInput(draft => { draft.y0 = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber; });
                            setCutoutParamsFlags(draft => { draft.y0 = true; });
                        }}
                    >
                        <NumberInput.Input placeholder={ cutoutParams.y0.toString() }/>
                    </NumberInput.Root>
                    <Text textStyle="sm">width</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW='60px'
                        value={cutoutParamsInput.width.toString()}
                        onValueChange={({ valueAsNumber }) => {
                            setCutoutParamsInput(draft => { draft.width = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber; });
                            setCutoutParamsFlags(draft => { draft.width = true; });
                        }}
                    >
                        <NumberInput.Input placeholder={ cutoutParams.width.toString() }/>
                    </NumberInput.Root>
                    <Text textStyle="sm">height</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW='60px'
                        value={cutoutParamsInput.height.toString()}
                        onValueChange={({ valueAsNumber }) => {
                            setCutoutParamsInput(draft => { draft.height = Number.isNaN(valueAsNumber) ? 0 : valueAsNumber; });
                            setCutoutParamsFlags(draft => { draft.height = true; });
                        }}
                    >
                        <NumberInput.Input placeholder={ cutoutParams.height.toString() }/>
                    </NumberInput.Root>
                </HStack>
                <Separator />
                <HStack gap={3}>
                    <Button 
                        size="sm" 
                        onClick={onConfirm}
                        variant="outline"
                    >
                        Confirm
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={onRetrieveCutout}
                        variant="surface"
                    >
                        Retrieve Cutout
                    </Button>
                    <Tooltip ids={{ trigger: switchId }} content="Show cutout region on the counterpart image">
                        <Switch.Root
                            size="md"
                            ids={{ root: switchId }}
                            checked={showCutout}
                            onCheckedChange={(e) => setShowCutout(e.checked)}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control/>
                            <Switch.Label>{showCutout ? "show" : "hide"}</Switch.Label>
                        </Switch.Root>
                    </Tooltip>
                </HStack>
            </Stack>
        </Box>
    )

}