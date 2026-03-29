import { GlobeSphere } from "../objects/GlobeSphere";

const GLOBE_COLOR = "#183245";

export interface GlobeLayerProps {
	radius: number;
}

export function GlobeLayer({ radius }: GlobeLayerProps) {
	return (
		<>
			<GlobeSphere radius={radius} color={GLOBE_COLOR} />
		</>
	);
}
