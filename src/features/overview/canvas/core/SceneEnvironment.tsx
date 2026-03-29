const BACKGROUND_COLOR = "#03060a";

export function SceneEnvironment() {
	return (
		<>
			<ambientLight intensity={0.7} />
			<hemisphereLight intensity={0.45} />
			<directionalLight position={[4, 5, 6]} intensity={1.2} />
			<color attach="background" args={[BACKGROUND_COLOR]} />
			<fog attach="fog" args={[BACKGROUND_COLOR, 4, 14]} />
		</>
	);
}
