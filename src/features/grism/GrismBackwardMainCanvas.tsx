
import { Box, Text } from "@chakra-ui/react";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import type { MapControls as MapControlsType } from "three-stdlib";

import GrismImageLayer from "@/components/three/GrismImageLayer";
import { RoiIndicator } from "@/components/three/RoiComponent";
import GrismBackwardCounterpartImageLayer from "@/features/grism/backward/layers/GrismBackwardCounterpartImageLayer";
import GrismBackwardTraceLayer from "@/features/grism/backward/layers/GrismBackwardTraceLayer";
import EmissionMaskLayer from "@/features/grism/backward/layers/EmissionMaskLayer";
import GrismBackwardFetchControl from "@/features/grism/backward/GrismBackwardFetchControl";
import GrismBackwardToolbar from "@/features/grism/GrismBackwardToolbar";
//import GrismTraceSourceDrawer from "@/features/grism/GrismTraceSourceDrawer";
import TraceSourceDrawer from "@/features/grism/GrismTraceSourceDrawer";
import { useGrismBackwardCanvas } from "@/features/grism/backward/hooks/useGrismBackwardCanvas";
import { useGrismInfoLegend } from "@/features/grism/backward/hooks/useGrismInfoLegend";
import { useCameraCenteringOnRoi, useCameraFollowRoi } from "@/hook/hotkey-hook";

export default function GrismBackwardMainCanvas({
	currentBasename,
}: {
	currentBasename: string | undefined;
}) {
	/* -------------------------------------------------------------------------- */
	/*                                 Hook Access                                */
	/* -------------------------------------------------------------------------- */
	const {
		roiState,
		backwardGlobalNorm,
		currentGrismData,
		currentGrismOffsets,
	} = useGrismBackwardCanvas({ currentBasename });

	/* -------------------------------------------------------------------------- */
	/*                                 Render View                                */
	/* -------------------------------------------------------------------------- */
	const controlRef = useRef<MapControlsType>(null);
	return (
		<Box position="relative" w="100%" h="100%" overflow="hidden" bg="black">
			<Canvas>
				<OrthographicCamera
					makeDefault
					position={[0, 0, 100]}
					zoom={0.5}
					near={0.1}
					far={1000}
				/>
				<MapControls
					ref={controlRef}
					enableRotate={false}
					screenSpacePanning
					minZoom={0.1}
					maxZoom={20}
				/>
				<CanvasController controlRef={controlRef} />
				<color attach="background" args={["#050505"]} />
				<GrismBackwardCounterpartImageLayer />
				<GrismBackwardTraceLayer />
				<EmissionMaskLayer />

				{currentGrismData && currentGrismOffsets && (
					<>
						<GrismImageLayer
							buffer={currentGrismData.buffer}
							width={currentGrismData.width}
							height={currentGrismData.height}
							dx={currentGrismOffsets.dx}
							dy={currentGrismOffsets.dy}
							vmin={backwardGlobalNorm.vmin ?? -0.05}
							vmax={backwardGlobalNorm.vmax ?? 0.05}
							isVisible={true}
						/>
						<RoiIndicator
							x={roiState.x}
							y={roiState.y}
							width={roiState.width}
							height={roiState.height}
						/>
					</>
				)}
			</Canvas>
			<GrismBackwardToolbar />
			<InfoLegend currentBasename={currentBasename} />
			<GrismBackwardFetchControl />
			<TraceSourceDrawer />
		</Box>
	);
}

function CanvasController({
	controlRef,
}: {
	controlRef: React.RefObject<MapControlsType | null>;
}) {
	useCameraCenteringOnRoi(controlRef);
	useCameraFollowRoi(controlRef);
	return null;
}

function InfoLegend({
	currentBasename,
}: {
	currentBasename: string | undefined;
}) {
	const { totalImages, currentIndex } = useGrismInfoLegend({ currentBasename });
	return (
		<Box
			position="absolute"
			bottom={4}
			left={4}
			bg="blackAlpha.700"
			px={3}
			py={1}
			borderRadius="full"
			pointerEvents="none"
			border="1px solid"
			borderColor="whiteAlpha.200"
		>
			<Text fontSize="xs" fontFamily="mono" color="gray.300">
				{currentBasename ?? "No Image Loaded"}
				<Text as="span" color="gray.500" ml={2}>
					({totalImages > 0 ? currentIndex + 1 : 0}/{totalImages})
				</Text>
			</Text>
		</Box>
	);
}
