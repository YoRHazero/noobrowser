import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { type RefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { MapControls } from "three-stdlib";
import { useGrismStore } from "@/stores/image";

export function useCameraCenteringOnRoi(
	controlRef: RefObject<MapControls | null>,
) {
	const roiState = useGrismStore((state) => state.roiState);
	const { camera } = useThree();
	useHotkeys(
		"shift+c",
		(e) => {
			e.preventDefault();
			const controls = controlRef.current;
			if (!controls || !camera || !roiState) return;

			const roiCenterX = roiState.x + roiState.width / 2;
			const roiCenterY = roiState.y + roiState.height / 2;

			gsap.killTweensOf(controls.target);
			gsap.killTweensOf(camera.position);

			gsap.to(controls.target, {
				x: roiCenterX,
				y: -roiCenterY,
				z: 0,
				duration: 0.5,
				ease: "power3.inOut",
				onUpdate: () => {
					controls.update();
				},
			});

			const cameraZ = camera.position.z;
			gsap.to(camera.position, {
				x: roiCenterX,
				y: -roiCenterY,
				z: cameraZ,
				duration: 0.5,
				ease: "power3.inOut",
			});

			controls.update();
		},
		[roiState, camera, controlRef],
	);
}
