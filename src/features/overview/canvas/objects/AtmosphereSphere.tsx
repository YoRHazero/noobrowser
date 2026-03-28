export interface AtmosphereSphereProps {
	radius: number;
	color?: string;
	opacity?: number;
}

export function AtmosphereSphere({
	radius,
	color = "#56cfe1",
	opacity = 0.15,
}: AtmosphereSphereProps) {
	return (
		<mesh>
			<sphereGeometry args={[radius, 32, 24]} />
			<meshBasicMaterial
				color={color}
				transparent={true}
				opacity={opacity}
				depthWrite={false}
			/>
		</mesh>
	);
}
