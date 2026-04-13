export function getRedshiftFactor(redshift: number): number {
	const safeRedshift = Number.isFinite(redshift) ? redshift : 0;
	return Math.max(1 + safeRedshift, Number.EPSILON);
}
