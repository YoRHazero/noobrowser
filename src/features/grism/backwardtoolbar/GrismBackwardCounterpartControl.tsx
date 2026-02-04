import {
	Box,
	HStack,
	Separator,
	Text,
	VStack,
} from "@chakra-ui/react";
import { FilterSelectorCard } from "@/components/ui/FilterSelectorCard";
import {
	HorizontalNormRangeSlider,
	HorizontalOpacitySlider,
} from "@/components/ui/internal-slider";
import CounterpartRetrieveButton from "./CounterpartRetrieveButton";
import CounterpartVisibilitySwitch from "./CounterpartVisibilitySwitch";
import { useCounterpartFilterControl } from "./hooks/useCounterpartFilterControl";

export default function GrismBackwardCounterpartControl() {
	const {
		availableFilters,
		filterRGB,
		setFilterRGB,
		displayMode,
		opacity,
		counterpartNorm,
		isImageGray,
		isRGBMode,
		handleNormPmaxChange,
		handleNormPminChange,
		handleOpacityChange,
		handleCardClick,
	} = useCounterpartFilterControl();

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
					<CounterpartRetrieveButton />
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
