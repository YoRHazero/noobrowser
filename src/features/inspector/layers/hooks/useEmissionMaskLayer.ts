import { useEmissionMask } from "@/hooks/query/image";
import { useInspectorStore } from "@/stores/inspector";
import { useShallow } from "zustand/react/shallow";

export function useEmissionMaskLayer() {
	const { emissionMaskMode, emissionMaskThreshold } = useInspectorStore(
		useShallow((state) => ({
			emissionMaskMode: state.emissionMaskMode,
			emissionMaskThreshold: state.emissionMaskThreshold,
		})),
	);

	const emissionMaskQuery = useEmissionMask({
		enabled: false, // Manual fetch only
	});



	// Texture creation moved to Component to handle multiple formats
	
	const maskData = emissionMaskQuery.data;

	return {
		isVisible:
			emissionMaskMode !== "hidden" && !!maskData,
		maskData,
		threshold: emissionMaskThreshold,
		isLoading: emissionMaskQuery.isLoading,

		mode: emissionMaskMode,
	};
}
