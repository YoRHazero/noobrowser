const SPEED_OF_LIGHT_KM_S = 299792.458;
const SIGMA_TO_FWHM = 2 * Math.sqrt(2 * Math.log(2));

export function sigmaUmToFwhmKmS(muUm: number, sigmaUm: number): number | null {
	if (!Number.isFinite(muUm) || !Number.isFinite(sigmaUm) || muUm <= 0) {
		return null;
	}

	return (SIGMA_TO_FWHM * Math.abs(sigmaUm) * SPEED_OF_LIGHT_KM_S) / muUm;
}
