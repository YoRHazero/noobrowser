export const OVERVIEW_CANVAS_CONSTANTS = {
	globeRadius: 1,
	cameraPosition: [0, 0, 3.25] as [number, number, number],
	cameraFov: 50,
	cameraNear: 0.001,
	cameraFar: 100,
	minCameraDistance: 1.008,
	maxCameraDistance: 8,
	linearZoomGapStep: 0.0012,
	minRotateSpeed: 0.0015,
	maxRotateSpeed: 1,
	rotateSpeedGamma: 1,
} as const;
