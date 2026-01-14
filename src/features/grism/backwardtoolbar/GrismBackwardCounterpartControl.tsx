import {
	Box,
	Button,
	HStack,
	Separator,
	Switch,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { FilterSelectorCard } from "@/components/ui/FilterSelectorCard";
import {
	HorizontalNormRangeSlider,
	HorizontalOpacitySlider,
} from "@/components/ui/internal-slider";
import { toaster } from "@/components/ui/toaster";
import {
	useCounterpartFootprint,
	useCounterpartImage,
	useQueryAxiosGet,
} from "@/hook/connection-hook";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore, useGrismStore } from "@/stores/image";

export default function GrismBackwardCounterpartControl() {
	const {
		availableFilters,
		setAvailableFilters,
		filterRGB,
		setFilterRGB,
		displayMode,
		setDisplayMode,
		opacity,
		setOpacity,
		counterpartNorm,
		setCounterpartNorm,
	} = useCounterpartStore(
		useShallow((state) => ({
			availableFilters: state.availableFilters,
			setAvailableFilters: state.setAvailableFilters,
			filterRGB: state.filterRGB,
			setFilterRGB: state.setFilterRGB,
			displayMode: state.displayMode,
			setDisplayMode: state.setDisplayMode,
			opacity: state.opacity,
			setOpacity: state.setOpacity,
			counterpartNorm: state.counterpartNorm,
			setCounterpartNorm: state.setCounterpartNorm,
		})),
	);
	/* ------------------------- Fetch Available Filters ------------------------ */
	const { data: filtersData, isSuccess: isFiltersSuccess } = useQueryAxiosGet<
		Array<string>
	>({
		queryKey: ["available_filters"],
		path: "/image/counterpart_meta/",
	});
	useEffect(() => {
		if (isFiltersSuccess && filtersData) {
			setAvailableFilters(filtersData);
		}
	}, [isFiltersSuccess, filtersData, setAvailableFilters]);
	/* -------------------------------------------------------------------------- */
	/*                                 Handlers                                  */
	/* -------------------------------------------------------------------------- */
	const handleNormPmaxChange = (value: number) => {
		setCounterpartNorm({ pmax: value });
	};
	const handleNormPminChange = (value: number) => {
		setCounterpartNorm({ pmin: value });
	};
	const handleOpacityChange = (value: number) => {
		setOpacity(value);
	};
	const handleCardClick = (channel: "r" | "g" | "b") => {
		if (displayMode === channel) {
			setDisplayMode("rgb");
		} else {
			setDisplayMode(channel);
		}
	};
	const isImageGray =
		filterRGB.r === filterRGB.g && filterRGB.g === filterRGB.b;
	const isRGBMode = displayMode === "rgb" && !isImageGray;
	/* -------------------------------------------------------------------------- */
	/*                                   Render                                   */
	/* -------------------------------------------------------------------------- */
	return (
		<VStack gap={4} align={"stretch"}>
			{/* Header */}
			<HStack justify={"space-between"}>
				<Text
					fontSize="xs"
					fontWeight="bold"
					color="gray.400"
					letterSpacing="wider"
				>
					Counterpart
				</Text>
				<HStack gap={4}>
					<CounterpartVisibilitySwitch />
					<RetreiveButton />
				</HStack>
			</HStack>
			{/* Filter Selector */}
			<Box>
				<HStack justify={"space-between"}>
					<Text fontSize="xs" color="pink.400" fontWeight="semibold">
						False Color Setup
					</Text>
				</HStack>

				<HStack gap={2} justify="space-between">
					<FilterSelectorCard
						label="R"
						value={filterRGB.r}
						options={availableFilters}
						color="red.400"
						isActive={
							displayMode.includes("r") && !!filterRGB.r && !isImageGray
						}
						onFilterChange={(v) => setFilterRGB({ ...filterRGB, r: v })}
						onCardClick={() => handleCardClick("r")}
					/>

					<FilterSelectorCard
						label="G"
						value={filterRGB.g}
						options={availableFilters}
						color="green.400"
						isActive={
							displayMode.includes("g") && !!filterRGB.g && !isImageGray
						}
						onFilterChange={(v) => setFilterRGB({ ...filterRGB, g: v })}
						onCardClick={() => handleCardClick("g")}
					/>

					<FilterSelectorCard
						label="B"
						value={filterRGB.b}
						options={availableFilters}
						color="blue.400"
						isActive={
							displayMode.includes("b") && !!filterRGB.b && !isImageGray
						}
						onFilterChange={(v) => setFilterRGB({ ...filterRGB, b: v })}
						onCardClick={() => handleCardClick("b")}
					/>
				</HStack>

				{/* 提示文本 */}
				<Text fontSize="2xs" color="gray.600" mt={1} textAlign="center">
					{isImageGray
						? `Viewing ${filterRGB.r} in grayscale.`
						: isRGBMode
							? "Viewing in RGB mode."
							: `Viewing in ${displayMode.toUpperCase()} channel in grayscale.`}
				</Text>
			</Box>

			{/* Norm Slider Vmin/Vmax are not supported now*/}
			<Box>
				<Text fontSize="xs" color="pink.400" fontWeight="semibold" mb={1}>
					Counterpart Norm
				</Text>
				<HorizontalNormRangeSlider
					pmin={counterpartNorm.pmin}
					pmax={counterpartNorm.pmax}
					vmin={undefined}
					vmax={undefined}
					onPminChange={handleNormPminChange}
					onPmaxChange={handleNormPmaxChange}
					onVminChange={() => {}}
					onVmaxChange={() => {}}
				/>
			</Box>
			{/* Opacity Slider */}
			<Box>
				<Text fontSize="xs" color="pink.400" fontWeight="semibold" mb={1}>
					Opacity
				</Text>
				<HorizontalOpacitySlider
					opacity={opacity}
					onOpacityChange={handleOpacityChange}
				/>
			</Box>
			{/* Separator */}
			<Separator my={5} />
		</VStack>
	);
}

function RetreiveButton() {
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const filterRGB = useCounterpartStore((state) => state.filterRGB);

	const {
		refetch: refetchCounterpartImage,
		isFetching: isFetchingCounterpartImage,
		isSuccess: isSuccessCounterpartImage,
		isError: isErrorCounterpartImage,
		error: errorCounterpartImage,
	} = useCounterpartImage({}); // automatically retrieved from store
	const {
		isFetching: isFetchingCounterpartFootprint,
		isError: isErrorCounterpartFootprint,
		error: errorCounterpartFootprint,
	} = useCounterpartFootprint({});

	useEffect(() => {
		if (isErrorCounterpartFootprint && errorCounterpartFootprint) {
			const message = errorCounterpartFootprint?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve footprint",
					description: message,
				});
			});
		}
		if (isErrorCounterpartImage && errorCounterpartImage) {
			const message = errorCounterpartImage?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve counterpart image",
					description: message,
				});
			});
		}
		if (isSuccessCounterpartImage) {
			queueMicrotask(() => {
				toaster.success({ title: "The image is successfully retrieved" });
			});
		}
	}, [
		isErrorCounterpartFootprint,
		errorCounterpartFootprint,
		isErrorCounterpartImage,
		errorCounterpartImage,
		isSuccessCounterpartImage,
	]);
	return (
		<Button
			size="xs"
			h="24px"
			px={3}
			variant="surface"
			colorPalette="pink"
			fontSize="xs"
			fontWeight="bold"
			loading={isFetchingCounterpartFootprint || isFetchingCounterpartImage}
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
						title: "Incomplete RGB filter",
						description: "Please set all RGB filter values.",
					});
					return;
				}
				refetchCounterpartImage();
			}}
			_hover={{
				bg: "pink.500",
				color: "white",
				borderColor: "pink.400",
			}}
		>
			<FiDownload /> Retrieve
		</Button>
	);
}

function CounterpartVisibilitySwitch() {
	const counterpartVisible = useGrismStore((state) => state.counterpartVisible);
	const setCounterpartVisible = useGrismStore(
		(state) => state.setCounterpartVisible,
	);
	return (
		<HStack gap={2}>
			<Text fontSize="xs" color={counterpartVisible ? "pink.400" : "gray.500"}>
				Counterpart: {counterpartVisible ? "Visible" : "Hidden"}
			</Text>
			<Switch.Root
				size="sm"
				colorPalette="pink"
				checked={counterpartVisible}
				onCheckedChange={(e) => setCounterpartVisible(e.checked)}
			>
				<Switch.HiddenInput />
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
			</Switch.Root>
		</HStack>
	);
}
