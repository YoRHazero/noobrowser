import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import Spectrum1DChart from "@/features/grism/spectrum1d/Spectrum1DChart";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";
import { useGrismStore } from "@/stores/image";
import extractFormatted1DSpectrum from "@/utils/extraction";

export default function Grism1DCanvas() {
	const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
		null,
	);
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
	const containerRef = useCallback((node: HTMLDivElement | null) => {
		setContainerNode(node);
	}, []);
	const { collapseWindow, spectrumQueryKey } = useGrismStore(
		useShallow((state) => ({
			collapseWindow: state.collapseWindow,
			spectrumQueryKey: state.spectrumQueryKey,
		})),
	);

	const { data: extractSpectrumData } = useQuery<ExtractedSpectrum | undefined>({
		queryKey: spectrumQueryKey ?? ["extract_spectrum", "empty"],
		queryFn: async () => undefined,
		enabled: false,
	});
	const spectrum1D = useMemo(() => {
		if (!extractSpectrumData || !extractSpectrumData.covered) {
			return [];
		}
		return (
			extractFormatted1DSpectrum(extractSpectrumData, collapseWindow, "row") ??
			[]
		);
	}, [extractSpectrumData, collapseWindow]);

	useEffect(() => {
		if (!containerNode) return;
		const updateWidth = () => {
			setContainerSize({
				width: containerNode.clientWidth,
				height: containerNode.clientHeight,
			});
		};
		updateWidth();
		const observer = new ResizeObserver(updateWidth);
		observer.observe(containerNode);
		return () => observer.disconnect();
	}, [containerNode]);
	const chartWidth = containerSize.width;
	const chartHeight = containerSize.height;
	return (
		<Box ref={containerRef} width="100%" height="100%" flex="1" minH={0}>
			{chartWidth > 0 && chartHeight > 0 && spectrum1D.length > 0 ? (
				<Spectrum1DChart
					spectrum1D={spectrum1D}
					width={chartWidth}
					height={chartHeight}
					margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
				/>
			) : null}
		</Box>
	);
}
