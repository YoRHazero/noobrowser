import { useGlobeStore } from "@/stores/footprints";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export function useGrismInfoLegend({
	currentBasename,
}: { currentBasename: string | undefined }) {
	const { footprints, selectedFootprintId } = useGlobeStore(
		useShallow((state) => ({
			footprints: state.footprints,
			selectedFootprintId: state.selectedFootprintId,
		})),
	);
	const basenameList: string[] = useMemo(() => {
		if (!selectedFootprintId) return [];
		const selectedFootprint = footprints.find(
			(fp) => fp.id === selectedFootprintId,
		);
		return selectedFootprint?.meta?.included_files ?? [];
	}, [footprints, selectedFootprintId]);
	const totalImages = basenameList.length;
	const currentIndex = currentBasename
		? basenameList.indexOf(currentBasename)
		: -1;

	return {
		totalImages,
		currentIndex,
	};
}
