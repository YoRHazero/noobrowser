import { Box, Button, HStack, NumberInput, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useGlobeAnimation } from "@/features/footprint/hooks/animation-hook";
import { useGlobeStore } from "@/stores/footprints";
import { centerRaDecToView, viewToCenterRaDec } from "@/utils/projection";

export default function FootprintToolkit() {
	const view = useGlobeStore((state) => state.view);
	const { animateToView } = useGlobeAnimation();
	const center = useMemo(
		() => viewToCenterRaDec(view.yawDeg, view.pitchDeg),
		[view.yawDeg, view.pitchDeg],
	);

	const [raInput, setRaInput] = useState<number>(center.ra);
	const [decInput, setDecInput] = useState<number>(center.dec);

	// whether the input fields have been modified since last sync
	const [raDirty, setRaDirty] = useState(false);
	const [decDirty, setDecDirty] = useState(false);

	const onGoTo = useCallback(() => {
		const targetRa = raDirty ? raInput : center.ra;
		const targetDec = decDirty ? decInput : center.dec;
		const { yawDeg, pitchDeg } = centerRaDecToView(targetRa, targetDec);
		animateToView(yawDeg, pitchDeg, 200);
		setRaDirty(false);
		setDecDirty(false);
	}, [
		raInput,
		decInput,
		raDirty,
		decDirty,
		center.ra,
		center.dec,
		animateToView,
	]);

	const onReset = useCallback(() => {
		animateToView(0, 0, 1);
		setRaDirty(false);
		setDecDirty(false);
	}, [animateToView]);
	const displayRa = raDirty ? raInput : center.ra;
	const displayDec = decDirty ? decInput : center.dec;
	return (
		<Box display="inline-flex" flexDirection="column" gap="8px">
			<HStack gap={2} p="6px 10px" rounded="md" boxShadow="sm">
				<HStack gap={1}>
					<Text>RA</Text>
					<NumberInput.Root
						size="sm"
						maxW="120px"
						value={String(displayRa)}
						onValueChange={({ valueAsNumber }) => {
							setRaInput(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
							setRaDirty(true);
						}}
					>
						<NumberInput.Input
							placeholder={
								Number.isFinite(center.ra) ? center.ra.toFixed(4) : ""
							}
						/>
					</NumberInput.Root>
				</HStack>
				<HStack gap={1}>
					<Text>Dec</Text>
					<NumberInput.Root
						size="sm"
						maxW="120px"
						value={String(displayDec)}
						onValueChange={({ valueAsNumber }) => {
							setDecInput(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
							setDecDirty(true);
						}}
					>
						<NumberInput.Input
							placeholder={
								Number.isFinite(center.dec) ? center.dec.toFixed(4) : ""
							}
						/>
					</NumberInput.Root>
				</HStack>
				<Button size="sm" onClick={onGoTo}>
					Go To
				</Button>
				<Button size="sm" onClick={onReset}>
					Reset View
				</Button>
			</HStack>
		</Box>
	);
}
