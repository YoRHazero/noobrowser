export interface EquatorialCoordinate {
	ra: number;
	dec: number;
}

export interface CartesianCoordinate {
	x: number;
	y: number;
	z: number;
}

export function createEquatorialCoordinate(
	ra: number,
	dec: number
): EquatorialCoordinate {
	return { ra, dec };
}

export function equatorialToCartesian(
	_coordinate: EquatorialCoordinate
): CartesianCoordinate {
	return { x: 0, y: 0, z: 0 };
}
