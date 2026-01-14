import {
	Box,
	Button,
	createListCollection,
	Field,
	Heading,
	HStack,
	Select,
	Separator,
	Stack,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { NormPercentageInput } from "@/components/ui/custom-component";
import { toaster } from "@/components/ui/toaster";
import {
	useCounterpartFootprint,
	useCounterpartImage,
	useQueryAxiosGet,
} from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";
import { clamp } from "@/utils/projection";

function RGBSelector({
	label,
	value,
	onValueChange,
	collection,
	width,
}: {
	label: string;
	value: string;
	onValueChange: (value: string) => void;
	collection: ReturnType<
		typeof createListCollection<{ label: string; value: string }>
	>;
	width: string;
}) {
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
						{collection.items.map((item) => (
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
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);

	const {
		availableFilters,
		filterRGB,
		counterpartNorm,
		setAvailableFilters,
		setFilterRGB,
		setCounterpartNorm,
	} = useCounterpartStore(
		useShallow((state) => ({
			availableFilters: state.availableFilters,
			filterRGB: state.filterRGB,
			counterpartNorm: state.counterpartNorm,
			setAvailableFilters: state.setAvailableFilters,
			setFilterRGB: state.setFilterRGB,
			setCounterpartNorm: state.setCounterpartNorm,
		})),
	);

	const filterCollection = useMemo(
		() =>
			createListCollection({
				items: availableFilters.map((filter) => ({
					label: filter,
					value: filter,
				})),
			}),
		[availableFilters],
	);
	/* Fetch available filters from backend */
	const { data: filtersData, isSuccess: isFiltersSuccess } = useQueryAxiosGet({
		queryKey: ["available_filters"],
		path: "/image/counterpart_meta",
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
	} = useCounterpartFootprint({ selectedFootprintId });
	const {
		refetch: refetchImage,
		isFetching: isImageFetching,
		isSuccess: isImageSuccess,
		isError: isImageError,
		error: imageError,
	} = useCounterpartImage({
		selectedFootprintId,
		normParams: counterpartNorm,
	});
	useEffect(() => {
		if (isFootprintError && footprintError) {
			const message = footprintError?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve counterpart",
					description: message,
				});
			});
		}
		if (isImageError && imageError) {
			const message = imageError?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve counterpart image",
					description: message,
				});
			});
		}
		if (isImageSuccess) {
			queueMicrotask(() => {
				toaster.success({ title: "The image is successfully retrieved" });
			});
		}
	}, [
		isFootprintError,
		footprintError,
		isImageError,
		imageError,
		isImageSuccess,
	]);

	/* normalization parameters */
	const handleNormPminChange = (next: number) => {
		const maxAllowedPmin = counterpartNorm.pmax - 5;
		const clampedValue = clamp(next, 0, maxAllowedPmin);
		setCounterpartNorm({ ...counterpartNorm, pmin: clampedValue });
	};
	const handleNormPmaxChange = (next: number) => {
		const minAllowedPmax = counterpartNorm.pmin + 5;
		const clampedValue = clamp(next, minAllowedPmax, 100);
		setCounterpartNorm({ ...counterpartNorm, pmax: clampedValue });
	};

	return (
		<Box p={5}>
			<Stack gap={3} h="full">
				{/* Filter selectors */}
				<Stack gap={3}>
					<Heading size="sm" as="h3">
						Select False Image Color
					</Heading>
					<HStack gap={4}>
						{/* RGB filter */}
						{(Object.keys(filterRGB) as Array<keyof typeof filterRGB>).map(
							(colorKey) => (
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
							),
						)}
					</HStack>
				</Stack>
				<Separator my={3} />
				{/* Normalization parameters */}
				<Stack gap={3}>
					<Heading size="sm" as="h3">
						Normalization
					</Heading>
					<HStack gap={4} align={"flex-end"}>
						<NormPercentageInput
							label="Pmin (%)"
							value={counterpartNorm.pmin}
							onValueChange={handleNormPminChange}
							width={numberInputWidth}
						/>
						<NormPercentageInput
							label="Pmax (%)"
							value={counterpartNorm.pmax}
							onValueChange={handleNormPmaxChange}
							width={numberInputWidth}
						/>
					</HStack>
				</Stack>
				<Separator my={3} />
				<HStack gap={3}>
					<Button
						size="sm"
						variant="solid"
						mb={0.5}
						loading={isImageFetching}
						onClick={() => {
							if (!selectedFootprintId) {
								toaster.error({
									title: "No footprint selected",
									description: "Please select a footprint first.",
								});
								return;
							}
							if (!filterRGB.r || !filterRGB.g || !filterRGB.b) {
								toaster.error({
									title: "No filter selected",
									description: "Please select all RGB filters.",
								});
								return;
							}
							refetchFootprint();
							refetchImage();
						}}
					>
						Retrieve Counterpart
					</Button>
				</HStack>
			</Stack>
		</Box>
	);
}
