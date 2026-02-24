import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQueryAxiosGet } from "@/hooks/query/useQueryAxiosGet";
import { useCounterpartStore } from "@/stores/image";

export function useCounterpartFilterControl() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
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

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	/* ------------------------- Fetch Available Filters ------------------------ */
	const { data: filtersData, isSuccess: isFiltersSuccess } = useQueryAxiosGet<
		Array<string>
	>({
		queryKey: ["available_filters"],
		path: "/image/counterpart_meta/",
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		if (isFiltersSuccess && filtersData) {
			setAvailableFilters(filtersData);
		}
	}, [isFiltersSuccess, filtersData, setAvailableFilters]);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
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

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const isImageGray =
		filterRGB.r === filterRGB.g && filterRGB.g === filterRGB.b;
	const isRGBMode = displayMode === "rgb" && !isImageGray;

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		availableFilters,
		filterRGB,
		setFilterRGB,
		displayMode,
		setDisplayMode,
		opacity,
		counterpartNorm,
		isImageGray,
		isRGBMode,
		handleNormPmaxChange,
		handleNormPminChange,
		handleOpacityChange,
		handleCardClick,
	};
}
