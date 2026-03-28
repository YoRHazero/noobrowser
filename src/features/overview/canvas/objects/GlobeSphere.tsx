export interface GlobeSphereProps {
	radius: number;
	color?: string;
}

export function GlobeSphere({ radius, color = "#101820" }: GlobeSphereProps) {
	return (
		<mesh>
			<sphereGeometry args={[radius, 48, 32]} />
			<meshStandardMaterial color={color} roughness={1} metalness={0} />
		</mesh>
	);
}
