import {
    Box,
    Stack,
    Heading,
    HStack,
    Select,
    Field,
    Separator,
    Button,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { toaster } from "@/components/ui/toaster";
import { useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { clamp } from "@/utils/projection";
import { PercentageInput } from "@/components/ui/custom-component";
import { useQueryAxiosGet, useCounterpartFootprint, useCounterpartImage } from "@/hook/connection-hook";
/*
                <Stack gap={3}>
                    <Heading size="sm" as='h3'>Cutout Parameters</Heading>
                    <HStack gap={4}>
                        <PercentageInput
                            label="Pmin (%)"
                            value={cutoutParams.cutoutPmin}
                            onValueChange={handleCutoutPminChange}
                            width={numberInputWidth}
                        />
                        <PercentageInput
                            label="Pmax (%)"
                            value={cutoutParams.cutoutPmax}
                            onValueChange={handleCutoutPmaxChange}
                            width={numberInputWidth}
                        />
                    </HStack>
                </Stack>
*/

function RGBSelector(
    {
        label,
        value,
        onValueChange,
        collection,
        width,
    }: {
        label: string;
        value: string;
        onValueChange: (value: string) => void;
        collection: ReturnType<typeof createListCollection<{ label: string; value: string }>>;
        width: string;
    }
) {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            <Select.Root
                collection={collection}
                size="sm"
                width={width}
                value={[value]}
                onValueChange={(details) => {
                    const v = details.value?.[0] ?? "";
                    onValueChange(v);
                }}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder={value} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                    <Select.Content>
                        {collection.items.map((item: any) => (
                            <Select.Item key={item.value} item={item}>
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Select.Root>
        </Field.Root>
    );
}

export default function CounterpartPanel() {
    const selectorWidth = "100px";
    const numberInputWidth = "80px";
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);

    const {
        availableFilters,
        filterRGB,
        normParams,
        setAvailableFilters,
        setFilterRGB,
        setNormParams,
    } = useCounterpartStore();

    const filterCollection = useMemo(() => createListCollection({
        items: availableFilters.map((filter) => ({ label: filter, value: filter })),
    }), [availableFilters]);
    /* Fetch available filters from backend */
    const { data: filtersData, isSuccess: isFiltersSuccess } = useQueryAxiosGet({
        queryKey: ['available_filters'],
        path: '/image/counterpart_meta',
    });
    useEffect(() => {
        if (isFiltersSuccess && filtersData) {
            setAvailableFilters(filtersData);
        }
    }, [isFiltersSuccess, filtersData, setAvailableFilters]);

    /* fetch counterpart data from backend */
    const { 
        refetch: refetchFootprint, 
        isError: isFootprintError,
        error: footprintError,
    } = useCounterpartFootprint(selectedFootprintId);
    const { 
        refetch: refetchImage,
        isSuccess: isImageSuccess,
        isError: isImageError,
        error: imageError,
    } = useCounterpartImage(
        selectedFootprintId,
        filterRGB.r,
        normParams,
    );
    useEffect(() => {
        if (isFootprintError && footprintError) {
            const message = footprintError?.message ?? "Unknown error";
            toaster.error({ title: "Failed to retrieve counterpart", description: message } );
        }
        if (isImageError && imageError) {
            const message = imageError?.message ?? "Unknown error";
            toaster.error({ title: "Failed to retrieve counterpart image", description: message } );
        }
        if (isImageSuccess) {
            toaster.success({ title: "The image is successfully retrieved" });
        }
    }, [isFootprintError, footprintError, isImageError, imageError, isImageSuccess]);

    /* normalization parameters */
    const handleNormPminChange = (next: number) => {
        const maxAllowedPmin = normParams.pmax - 5;
        const clampedValue = clamp(next, 0, maxAllowedPmin);
        setNormParams({ ...normParams, pmin: clampedValue });
    };
    const handleNormPmaxChange = (next: number) => {
        const minAllowedPmax = normParams.pmin + 5;
        const clampedValue = clamp(next, minAllowedPmax, 100);
        setNormParams({ ...normParams, pmax: clampedValue });
    };

    /* cutout parameters 
    const handleCutoutPminChange = (next: number) => {
        const maxAllowedCutoutPmin = cutoutParams.cutoutPmax - 5;
        const clampedValue = clamp(next, 0, maxAllowedCutoutPmin);
        setCutoutParams({ ...cutoutParams, cutoutPmin: clampedValue });
    };
    const handleCutoutPmaxChange = (next: number) => {
        const minAllowedCutoutPmax = cutoutParams.cutoutPmin + 5;
        const clampedValue = clamp(next, minAllowedCutoutPmax, 100);
        setCutoutParams({ ...cutoutParams, cutoutPmax: clampedValue });
    };
    */

    return (
        <Box p={5} >
            <Stack gap={3} h='full'>
                {/* Filter selectors */}
                <Stack gap={3}>
                    <Heading size="sm" as='h3'>
                        Select False Image Color
                    </Heading>
                     <HStack gap={4}>
                        {/* RGB filter */}
                        {(Object.keys(filterRGB) as Array<keyof typeof filterRGB>).map((colorKey) => (
                            <RGBSelector
                                key={colorKey}
                                label={colorKey.toUpperCase()}
                                value={filterRGB[colorKey as keyof typeof filterRGB]}
                                onValueChange={(value) => {
                                    setFilterRGB({ ...filterRGB, [colorKey]: value });
                                }}
                                collection={filterCollection}
                                width={selectorWidth}
                            />
                        ))}
                    </HStack>
                </Stack>
            <Separator my={3} />
            {/* Normalization parameters */}
                <Stack gap={3}>
                    <Heading size="sm" as='h3' >
                        Normalization Parameters
                    </Heading>
                    <HStack gap={4}>
                        <PercentageInput
                            label="Pmin (%)"
                            value={normParams.pmin}
                            onValueChange={handleNormPminChange}
                            width={numberInputWidth}
                        />
                        <PercentageInput
                            label="Pmax (%)"
                            value={normParams.pmax}
                            onValueChange={handleNormPmaxChange}
                            width={numberInputWidth}
                        />
                    </HStack>
                </Stack>
                <Separator my={3} />
                {/* retrieve button */}
                <HStack gap={3}>
                    <Button
                        size="sm"
                        variant="surface"
                        onClick={() => {
                            if (!selectedFootprintId) {
                                toaster.error({ title: "No footprint selected", description: "Please select a footprint first." });
                                return;
                            }
                            if (!filterRGB.r) {
                                toaster.error({ title: "No filter selected", description: "Please select at least the red filter." });
                                return;
                            }
                            refetchFootprint();
                            refetchImage();
                        }}
                    >
                        Retrieve
                    </Button>
                </HStack>
            </Stack>

        </Box>
    )

}
