export interface TooltipProjectionPoint {
	x: number;
	y: number;
}

export function useTooltipProjection() {
	return {
		screenPoint: null as TooltipProjectionPoint | null,
	};
}
