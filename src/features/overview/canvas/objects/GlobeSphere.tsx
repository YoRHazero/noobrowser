export interface GlobeSphereProps {
	radius: number;
	color?: string;
}

export function GlobeSphere({ radius, color = "#101820" }: GlobeSphereProps) {
	return (
		<mesh>
			<sphereGeometry args={[radius, 48, 32]} />
			<meshStandardMaterial
				color={color}
				roughness={0.92}
				metalness={0.04}
				emissive="#0a1620"
				emissiveIntensity={0.4}
			/>
		</mesh>
	);
}
