import { normalizeEmissionLineIds } from "./normalizeEmissionLineIds";

export function areEmissionLineIdSetsEqual(
	left: readonly string[],
	right: readonly string[],
): boolean {
	const normalizedLeft = normalizeEmissionLineIds(left);
	const normalizedRight = normalizeEmissionLineIds(right);

	if (normalizedLeft.length !== normalizedRight.length) {
		return false;
	}

	return normalizedLeft.every(
		(lineId, index) => lineId === normalizedRight[index],
	);
}
