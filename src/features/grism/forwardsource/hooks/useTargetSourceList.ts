import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSourcesStore } from "@/stores/sources";

export function useTargetSourceList() {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { traceSources } = useSourcesStore(
		useShallow((state) => ({
			traceSources: state.traceSources,
		})),
	);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const readySources = useMemo(
		() => traceSources.filter((source) => source.spectrumReady),
		[traceSources],
	);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		readySources,
	};
}
