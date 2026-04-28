export function resolveAutoFitConfigurationName(gaussianCount: number): string {
	if (gaussianCount <= 1) {
		return "single gaussian";
	}

	if (gaussianCount === 2) {
		return "double gaussian";
	}

	if (gaussianCount === 3) {
		return "triple gaussian";
	}

	return `${gaussianCount} gaussian`;
}
