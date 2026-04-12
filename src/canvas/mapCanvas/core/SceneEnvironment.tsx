import { MAP_CANVAS_BACKGROUND_COLOR } from "../shared/constants";

export function SceneEnvironment() {
	return (
		<>
			<ambientLight intensity={0.7} />
			<hemisphereLight intensity={0.45} />
			<directionalLight position={[4, 5, 6]} intensity={1.2} />
			<color attach="background" args={[MAP_CANVAS_BACKGROUND_COLOR]} />
			<fog attach="fog" args={[MAP_CANVAS_BACKGROUND_COLOR, 4, 14]} />
		</>
	);
}
