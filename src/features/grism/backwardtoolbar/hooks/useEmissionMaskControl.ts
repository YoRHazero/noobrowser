import { useShallow } from "zustand/react/shallow";
import { useEmissionMask } from "@/hooks/query/image";
import { useGrismStore } from "@/stores/image";

export function useEmissionMaskControl() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const {
		emissionMaskMode,
		setEmissionMaskMode,
		emissionMaskThreshold,
		setEmissionMaskThreshold,
	} = useGrismStore(
		useShallow((state) => ({
			emissionMaskMode: state.emissionMaskMode,
			setEmissionMaskMode: state.setEmissionMaskMode,
			emissionMaskThreshold: state.emissionMaskThreshold,
			setEmissionMaskThreshold: state.setEmissionMaskThreshold,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const {
		data: maskData,
		isLoading,
		refetch,
		isFetching,
	} = useEmissionMask({
		enabled: false, // Manual fetch
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleFetch = () => {
		refetch();
	};

	// Cycle modes: Hidden -> Individual -> Total -> Hidden
	const toggleMode = () => {
		if (emissionMaskMode === "hidden") setEmissionMaskMode("individual");
		else if (emissionMaskMode === "individual") setEmissionMaskMode("total");
		else setEmissionMaskMode("hidden");
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		emissionMaskMode,
		setEmissionMaskMode,
		emissionMaskThreshold,
		setEmissionMaskThreshold,
		maskData,
		isLoading,
		isFetching,
		handleFetch,
		toggleMode,
	};
}
