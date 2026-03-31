import { useSelectedOverviewFootprint } from "@/features/inspector/hooks/useSelectedOverviewFootprint";

export function useGrismInfoLegend({
	currentBasename,
}: { currentBasename: string | undefined }) {
	const { basenameList } = useSelectedOverviewFootprint();
	const totalImages = basenameList.length;
	const currentIndex = currentBasename
		? basenameList.indexOf(currentBasename)
		: -1;

	return {
		totalImages,
		currentIndex,
	};
}
