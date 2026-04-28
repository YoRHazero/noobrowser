const SPEED_OF_LIGHT_KM_S = 299792.458;
const SIGMA_TO_FWHM = 2 * Math.sqrt(2 * Math.log(2));

export function fwhmKmSToSigmaUm(muUm: number, fwhmKmS: number): number | null {
	if (
		!Number.isFinite(muUm) ||
		!Number.isFinite(fwhmKmS) ||
		muUm <= 0 ||
		fwhmKmS < 0
	) {
		return null;
	}

	return (fwhmKmS * muUm) / (SIGMA_TO_FWHM * SPEED_OF_LIGHT_KM_S);
}
