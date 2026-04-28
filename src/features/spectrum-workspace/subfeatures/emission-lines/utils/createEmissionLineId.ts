export function createEmissionLineId(
	name: string,
	restWavelengthUm: number,
	existingIds: Iterable<string>,
): string {
	const baseId = [
		"custom",
		name
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "")
			.slice(0, 32) || "line",
		Math.round(restWavelengthUm * 1_000_000).toString(),
	].join(":");
	const takenIds = new Set(existingIds);

	if (!takenIds.has(baseId)) {
		return baseId;
	}

	let suffix = 2;
	while (takenIds.has(`${baseId}:${suffix}`)) {
		suffix += 1;
	}

	return `${baseId}:${suffix}`;
}
