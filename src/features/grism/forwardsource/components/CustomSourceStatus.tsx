import { Badge } from "@chakra-ui/react";
import type { ExtractedSpectrum } from "@/hooks/query/source/schemas";

interface CustomSourceStatusProps {
	enabled: boolean;
	isFetching: boolean;
	isError: boolean;
	isSuccess: boolean;
	data: ExtractedSpectrum | undefined;
	isDisplayed: boolean;
}

export default function CustomSourceStatus({
	enabled,
	isFetching,
	isError,
	isSuccess,
	data,
	isDisplayed,
}: CustomSourceStatusProps) {
	if (!enabled) {
		return (
			<Badge colorPalette="gray" variant="solid" size="xs" opacity={0.5}>
				DISABLED
			</Badge>
		);
	}

	if (isFetching) {
		return (
			<Badge colorPalette="blue" variant="solid" size="xs">
				EXTRACTING...
			</Badge>
		);
	}

	if (isError) {
		return (
			<Badge colorPalette="red" variant="solid" size="xs">
				ERROR
			</Badge>
		);
	}

	if (isSuccess && isDisplayed) {
		if (data?.covered) {
			return (
				<Badge colorPalette="green" variant="solid" size="xs">
					DISPLAYED
				</Badge>
			);
		}
		return (
			<Badge colorPalette="orange" variant="solid" size="xs">
				NOT COVERED
			</Badge>
		);
	}

	// Default state when enabled but not fetching/error/success-displayed
	return (
		<Badge colorPalette="gray" variant="solid" size="xs">
			EDITABLE
		</Badge>
	);
}
