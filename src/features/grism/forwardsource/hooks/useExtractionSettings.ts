import { useShallow } from "zustand/react/shallow";
import { useFitStore } from "@/stores/fit";
import type { FitExtractionSettings } from "@/stores/stores-types";

const DEFAULT_EXTRACT_MODE: FitExtractionSettings["extractMode"] = "GRISMR";

export function useExtractionSettings() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { fitExtraction, setFitExtraction } = useFitStore(
		useShallow((state) => ({
			fitExtraction: state.fitExtraction,
			setFitExtraction: state.setFitExtraction,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const setFitApertureSize = (value: number) => {
		setFitExtraction({ apertureSize: value });
	};

	const setFitOffset = (value: number) => {
		setFitExtraction({ offset: value });
	};

	const setFitExtractMode = (value: string[]) => {
		const nextMode =
			(value[0] as FitExtractionSettings["extractMode"]) ??
			DEFAULT_EXTRACT_MODE;
		setFitExtraction({ extractMode: nextMode });
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		fitApertureSize: fitExtraction.apertureSize,
		fitOffset: fitExtraction.offset,
		fitExtractMode: [fitExtraction.extractMode],
		setFitApertureSize,
		setFitOffset,
		setFitExtractMode,
	};
}
