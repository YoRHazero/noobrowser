export interface FootprintGeometryVertex {
	ra: number;
	dec: number;
}

export function toFootprintGeometryVertices(
	vertices: FootprintGeometryVertex[]
): FootprintGeometryVertex[] {
	return vertices;
}
