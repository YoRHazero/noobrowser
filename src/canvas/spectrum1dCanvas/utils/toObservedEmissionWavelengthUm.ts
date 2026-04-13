import { getRedshiftFactor } from "./getRedshiftFactor";

export function toObservedEmissionWavelengthUm(
	restWavelengthUm: number,
	redshift: number,
): number {
	return restWavelengthUm * getRedshiftFactor(redshift);
}
