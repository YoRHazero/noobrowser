
// @/features/grism/spectrum1d/index.tsx
import { Box } from "@chakra-ui/react";
import Spectrum1DChart from "./Spectrum1DChart";
import { useChartResize } from "./hooks/useChartResize";
import { useSpectrum1DData } from "./hooks/useSpectrum1DData";

export default function Spectrum1DView() {
	const { spectrum1D } = useSpectrum1DData();
	const { containerRef, width, height } = useChartResize();

	return (
		<Box ref={containerRef} width="100%" height="100%" flex="1" minH={0}>
			{width > 0 && height > 0 && spectrum1D.length > 0 ? (
				<Spectrum1DChart
					spectrum1D={spectrum1D}
					width={width}
					height={height}
					margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
				/>
			) : null}
		</Box>
	);
}
