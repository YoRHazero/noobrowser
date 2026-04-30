import { Box, HStack, Text } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";

export function CollapsedSpectrumControls({
	referencePixel,
	referenceWavelengthAngstrom,
	fwhmKmS,
	onReferenceWavelengthChange,
	onFwhmChange,
}: {
	referencePixel: number;
	referenceWavelengthAngstrom: number;
	fwhmKmS: number;
	onReferenceWavelengthChange: (value: number) => void;
	onFwhmChange: (value: number) => void;
}) {
	return (
		<HStack
			w="100%"
			px={2}
			py={1}
			gap={2}
			justify="space-between"
			borderTopWidth="1px"
			borderColor="whiteAlpha.100"
		>
			<CompactNumberInput
				label="λ ref"
				value={referenceWavelengthAngstrom}
				onChange={onReferenceWavelengthChange}
				step={10}
				min={1}
				decimalScale={1}
				labelWidth="36px"
				inputWidth="96px"
				showControls={false}
			/>
			<CompactNumberInput
				label="FWHM"
				value={fwhmKmS}
				onChange={onFwhmChange}
				step={50}
				min={0}
				decimalScale={1}
				labelWidth="42px"
				inputWidth="76px"
				showControls={false}
			/>
			<Box minW="72px" textAlign="right">
				<Text textStyle="2xs" color="fg.muted" fontFamily="mono">
					pix {referencePixel.toFixed(1)}
				</Text>
			</Box>
		</HStack>
	);
}
