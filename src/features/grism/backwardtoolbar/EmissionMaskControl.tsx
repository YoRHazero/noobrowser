import {
	Box,
	Button,
	HStack,
	Icon,
	IconButton,
	Slider,
	Text,
	VStack,
} from "@chakra-ui/react";
import { FaDownload, FaEye, FaEyeSlash, FaLayerGroup } from "react-icons/fa";

import EmissionMaskColorLegend from "./components/EmissionMaskColorLegend";
import { useEmissionMaskControl } from "./hooks/useEmissionMaskControl";

export default function EmissionMaskControl() {
	const {
		emissionMaskMode,
		emissionMaskThreshold,
		setEmissionMaskThreshold,
		maskData,
		isLoading,
		isFetching,
		handleFetch,
		toggleMode,
	} = useEmissionMaskControl();

	return (
		<VStack gap={3} align="stretch">
			{/* Header with Mode Toggle & Fetch */}
			<HStack justify="space-between">
				<Text
					fontSize="xs"
					fontWeight="bold"
					color="gray.400"
					letterSpacing="wider"
				>
					Emission Mask
				</Text>
				<HStack gap={1}>
					{/* Fetch Button */}
					<IconButton
						size="xs"
						variant="ghost"
						colorPalette="cyan"
						loading={isFetching || isLoading}
						onClick={handleFetch}
						aria-label="Fetch Emission Mask"
						disabled={isFetching || isLoading}
					>
						<FaDownload />
					</IconButton>

					{/* Mode Toggle Button */}
					<Button
						size="xs"
						variant={emissionMaskMode === "hidden" ? "ghost" : "subtle"}
						colorPalette={emissionMaskMode === "hidden" ? "gray" : "cyan"}
						onClick={toggleMode}
						minW="80px"
					>
						{emissionMaskMode === "hidden" && (
							<>
								<Icon mr={1}>
									<FaEyeSlash />
								</Icon>
								Hidden
							</>
						)}
						{emissionMaskMode === "individual" && (
							<>
								<Icon mr={1}>
									<FaEye />
								</Icon>
								Individual
							</>
						)}
						{emissionMaskMode === "total" && (
							<>
								<Icon mr={1}>
									<FaLayerGroup />
								</Icon>
								Total
							</>
						)}
					</Button>
				</HStack>
			</HStack>

			{/* Controls - show when not hidden */}
			{emissionMaskMode !== "hidden" && (
				<>
					<EmissionMaskColorLegend
						frameCount={maskData?.frameCount ?? 8}
						threshold={emissionMaskThreshold}
					/>

					{/* Threshold Slider - Only for Total Mode? Or both? Logic: Total mode usually needs thresholding. Individual mode user said opacity 1.0, so maybe disabled? */
					/* User check: "individual显示...mask所有pixel的不透明度为1". 
					   If opacity is 1, thresholding might still apply if we want to hide "0 count" pixels (which are hidden by default anyway).
					   But if backend sends explicit mask, maybe we don't need threshold for Individual.
					   Let's keep it visible for now but disable if Individual? Or just let user adjust.
					   Actually, for bitmask, "value" (count) is 0 or 1 in individual. 
					   So threshold 0 is fine. Threshold 1 would hide everything.
					   Let's keep it but perhaps disable for Individual or clarify UI.
					   For now, just render it. */
					}
					<Box
						opacity={emissionMaskMode === "individual" ? 0.5 : 1}
						pointerEvents={
							emissionMaskMode === "individual" ? "none" : "auto"
						}
					>
						<HStack justify="space-between" mb={1}>
							<Text fontSize="xs" color="cyan.400" fontWeight="semibold">
								Transparency Threshold
							</Text>
							<Text fontSize="xs" color="gray.400" fontFamily="mono">
								≤ {emissionMaskThreshold}
							</Text>
						</HStack>
						<Slider.Root
							size="sm"
							min={0}
							max={Math.max((maskData?.frameCount ?? 8) - 1, 1)}
							step={1}
							value={[emissionMaskThreshold]}
							onValueChange={(e) => setEmissionMaskThreshold(e.value[0])}
							disabled={emissionMaskMode === "individual"}
						>
							<Slider.Control>
								<Slider.Track>
									<Slider.Range />
								</Slider.Track>
								<Slider.Thumb index={0} />
							</Slider.Control>
						</Slider.Root>
						<Text fontSize="2xs" color="gray.600" mt={1}>
							{emissionMaskMode === "individual"
								? "Threshold disabled in Individual mode"
								: `Pixels with value ≤ ${emissionMaskThreshold} will be transparent`}
						</Text>
					</Box>
				</>
			)}
		</VStack>
	);
}
