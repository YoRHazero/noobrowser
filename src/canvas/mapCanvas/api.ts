export interface MapCanvasProps {
	model: MapCanvasModel;
	actions: MapCanvasActions;
}

export interface MapCanvasModel {
	footprints: MapCanvasFootprintModel[];
	sources: MapCanvasSourceModel[];
	selectedFootprintId: string | null;
	showGrid: boolean;
	tooltipMode: MapCanvasTooltipMode;
	coordinatePrecision: number;
}

export interface MapCanvasActions {
	selectFootprint: (id: string | null) => void;
	requestCreateSource?: (event: MapCanvasCreateSourceEvent) => void;
}

export interface MapCanvasFootprintModel {
	id: string;
	vertices: MapCanvasSkyCoordinate[];
	center: MapCanvasSkyCoordinate;
	files: string[];
}

export interface MapCanvasSourceModel {
	id: string;
	label?: string;
	coordinate: MapCanvasSkyCoordinate;
	color: string;
	visible: boolean;
	active: boolean;
}

export interface MapCanvasSkyCoordinate {
	ra: number;
	dec: number;
}

export interface MapCanvasScreenPoint {
	x: number;
	y: number;
}

export interface MapCanvasCreateSourceEvent {
	coordinate: MapCanvasSkyCoordinate;
	anchor: MapCanvasScreenPoint;
	trigger: "context-menu";
}

export type MapCanvasTooltipMode = "footprint" | "coordinate";
