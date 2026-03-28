import { OVERVIEW_CANVAS_CONSTANTS } from "./constants";

export function SceneEnvironment() {
	return (
		<>
			<ambientLight intensity={0.7} />
			<hemisphereLight intensity={0.45} />
			<directionalLight position={[4, 5, 6]} intensity={1.2} />
			<color attach="background" args={[OVERVIEW_CANVAS_CONSTANTS.backgroundColor]} />
			<fog
				attach="fog"
				args={[OVERVIEW_CANVAS_CONSTANTS.backgroundColor, 4, 14]}
			/>
		</>
	);
}
