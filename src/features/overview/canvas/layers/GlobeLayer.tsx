import { AtmosphereSphere } from "../objects/AtmosphereSphere";
import { GlobeSphere } from "../objects/GlobeSphere";

export interface GlobeLayerProps {
	radius: number;
	showAtmosphere: boolean;
}

export function GlobeLayer({ radius, showAtmosphere }: GlobeLayerProps) {
	return (
		<>
			<GlobeSphere radius={radius} color="#101820" />
			{showAtmosphere ? (
				<AtmosphereSphere
					radius={radius * 1.035}
					color="#56cfe1"
					opacity={0.12}
				/>
			) : null}
		</>
	);
}
