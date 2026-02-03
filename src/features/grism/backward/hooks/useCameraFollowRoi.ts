import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { type RefObject, useEffect } from "react";
import type { MapControls } from "three-stdlib";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/image";

export function useCameraFollowRoi(controlRef: RefObject<MapControls | null>) {
	const { roiState, followRoiCamera } = useGrismStore(
		useShallow((state) => ({
			roiState: state.roiState,
			followRoiCamera: state.followRoiCamera,
		})),
	);
	const { camera } = useThree();

	useEffect(() => {
		if (!followRoiCamera) return;
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
			duration: 0.35,
			ease: "power3.inOut",
			overwrite: "auto",
			onUpdate: () => {
				controls.update();
			},
		});

		gsap.to(camera.position, {
			x: roiCenterX,
			y: -roiCenterY,
			z: camera.position.z,
			duration: 0.35,
			ease: "power3.inOut",
			overwrite: "auto",
		});
	}, [
		followRoiCamera,
		roiState.x,
		roiState.y,
		roiState.width,
		roiState.height,
		camera,
		controlRef,
	]);
}
