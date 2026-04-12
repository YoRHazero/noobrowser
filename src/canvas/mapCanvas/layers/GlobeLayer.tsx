import { GlobeSphere } from "../objects/GlobeSphere";

export interface GlobeLayerProps {
	radius: number;
}

export function GlobeLayer({ radius }: GlobeLayerProps) {
	return <GlobeSphere radius={radius} />;
}
