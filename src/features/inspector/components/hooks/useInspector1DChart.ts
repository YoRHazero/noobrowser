import { useState } from "react";
import { useRoiSpectrum1D } from "@/features/inspector/hooks/useRoiSpectrum1D";
import { useDispersionTrace } from "@/hooks/query/source/useDispersionTrace";
import { SPEED_OF_LIGHT_KM_S } from "@/utils/wavelength";

export function useInspector1DChart({
	currentBasename,
}: {
	currentBasename: string | undefined;
}) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const { spectrum1D, roiCollapseWindow } = useRoiSpectrum1D(currentBasename);

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [refIndex, setRefIndex] = useState<number>(roiCollapseWindow.waveMin);
	const [Lambda0, setLambda0] = useState<number>(40000); // in Angstrom
	const [FWHM, setFWHM] = useState<number>(1000); // in km/s

	/* -------------------------------------------------------------------------- */
	/*                              Mutations/Query                               */
	/* -------------------------------------------------------------------------- */
	const { data: dispersionTrace, isSuccess } = useDispersionTrace({
		enabled: true,
		waveMin: 4,
		waveMax: 4.8,
	});

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const angstromPerPixel =
		isSuccess && dispersionTrace ? dispersionTrace.mean_pixel_scale * 10000 : 1; // mean_pixel_scale in micron -> angstrom; default to 1 if no data
	
    const kmsPerPixel = (angstromPerPixel * SPEED_OF_LIGHT_KM_S) / Lambda0;
	
    const hasData = spectrum1D.length > 0;

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
    // None

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
    // Actions are handled via inline setters for simple states

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		spectrum1D,
		roiCollapseWindow,
		refIndex,
		setRefIndex,
		Lambda0,
		setLambda0,
		FWHM,
		setFWHM,
		isSuccess,
		kmsPerPixel,
        hasData
	};
}
