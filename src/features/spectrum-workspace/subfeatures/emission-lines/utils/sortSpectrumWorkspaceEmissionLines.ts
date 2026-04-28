import type { SpectrumWorkspaceEmissionLine } from "../shared/types";

export function sortSpectrumWorkspaceEmissionLines(
	lines: readonly SpectrumWorkspaceEmissionLine[],
): SpectrumWorkspaceEmissionLine[] {
	return [...lines].sort((left, right) => {
		if (left.restWavelengthUm !== right.restWavelengthUm) {
			return left.restWavelengthUm - right.restWavelengthUm;
		}

		const nameOrder = left.name.localeCompare(right.name);
		if (nameOrder !== 0) {
			return nameOrder;
		}

		return left.id.localeCompare(right.id);
	});
}
