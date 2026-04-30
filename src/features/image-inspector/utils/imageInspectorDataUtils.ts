export function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : "Unknown error";
}

export function getIncludedFiles(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(
		(item): item is string =>
			typeof item === "string" && item.trim().length > 0,
	);
}

export function isValidImageSize(width: number, height: number) {
	return (
		Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
	);
}
