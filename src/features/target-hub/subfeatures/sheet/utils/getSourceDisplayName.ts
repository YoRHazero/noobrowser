type SourceDisplayNameInput = {
	id: string;
	label?: string | null;
};

export function getSourceDisplayName(source: SourceDisplayNameInput) {
	const trimmed = source.label?.trim();
	return trimmed ? trimmed : source.id;
}
