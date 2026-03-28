export interface GrismFootprintGeometry {
	vertices: Array<[number, number]>;
	center: [number, number];
	[key: string]: unknown;
}

export interface GrismFootprintMeta {
	included_files: string[];
	[key: string]: unknown;
}

export interface GrismFootprintItem {
	id: string;
	footprint: GrismFootprintGeometry;
	meta: GrismFootprintMeta;
}

export interface ClearImageFiltersResponse {
	filters: string[];
}
