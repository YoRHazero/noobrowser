export interface SummarizedTooltipFiles {
	previewFiles: string[];
	overflowCount: number;
}

export function summarizeTooltipFiles(
	files: string[],
	maxPreviewFiles: number,
): SummarizedTooltipFiles {
	const previewFiles = files.slice(0, maxPreviewFiles);
	const overflowCount = Math.max(0, files.length - previewFiles.length);

	return {
		previewFiles,
		overflowCount,
	};
}
