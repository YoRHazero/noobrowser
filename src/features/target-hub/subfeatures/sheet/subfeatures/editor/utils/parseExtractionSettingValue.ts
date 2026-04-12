export function parseExtractionSettingValue(value: string): number | null {
	const trimmedValue = value.trim();
	if (trimmedValue.length === 0) {
		return null;
	}

	const parsedValue = Number(trimmedValue);
	return Number.isFinite(parsedValue) ? parsedValue : null;
}
