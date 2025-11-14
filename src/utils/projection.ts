/**
 * Converts an angle from degrees to radians.
 * @param deg - Angle in degrees.
 * @returns The angle expressed in radians.
 */
export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}
/**
 * Wraps an angle in degrees to the range [-180, 180].
 * @param deg - Angle in degrees.
 * @returns The angle wrapped to the range [-180, 180].
 */
export function wrapDeg180(deg: number): number {
    let x = ((deg + 180) % 360 + 360) % 360 - 180;
    if (x === -180) x = 180;
    return x;
}
/**
 * Wraps an angle in degrees to the range [0, 360].
 * @param deg - Angle in degrees.
 * @returns The angle wrapped to the range [0, 360].
 */
export function wrapDeg360(deg: number): number {
    return ((deg % 360) + 360) % 360;
}

/**
 * Clamps a value between a minimum and maximum.
 * @param value - The value to clamp.
 * @param min - The minimum allowable value.
 * @param max - The maximum allowable value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export type Projected = {
    x: number;
    y: number;
    z: number;
    visible: boolean;
};

/**
 * Projects right ascension and declination into a 3D camera space after applying yaw and pitch rotations.
 * @param raDeg - Right ascension in degrees.
 * @param decDeg - Declination in degrees.
 * @param yawDeg - Yaw rotation in degrees, applied around the Y axis.
 * @param pitchDeg - Pitch rotation in degrees, applied around the X axis.
 * @returns The projected coordinates along with a visibility flag indicating whether the point is in front of the viewer.
 */
export function projectRaDec(
    raDeg: number,
    decDeg: number,
    yawDeg: number,
    pitchDeg: number,
): Projected {
    const ra = deg2rad(raDeg);
    const dec = deg2rad(decDeg);
    const yaw = deg2rad(yawDeg);
    const pitch = deg2rad(pitchDeg);

    const cx = Math.cos(ra) * Math.cos(dec);
    const cy = Math.sin(dec);
    const cz = Math.sin(ra) * Math.cos(dec);

    // Rotate around Y axis (yaw)
    const cosy = Math.cos(yaw);
    const siny = Math.sin(yaw);
    const x1 = cosy * cx + siny * cz;
    const z1 = -siny * cx + cosy * cz;
    const y1 = cy;

    // Rotate around X axis (pitch)
    const cosp = Math.cos(pitch);
    const sinp = Math.sin(pitch);
    const y2 = cosp * y1 - sinp * z1;
    const z2 = sinp * y1 + cosp * z1;
    const x2 = x1;

    return { x: x2, y: y2, z: z2, visible: z2 > 0 };
}

/**
 * Converts a projected 3D point into 2D screen coordinates using the provided viewport parameters.
 * @param p - The projected 3D point with visibility information.
 * @param cx - Horizontal center position of the viewport (pixel).
 * @param cy - Vertical center position of the viewport (pixel).
 * @param scale - Scale factor applied to the projected coordinates.
 * @param radius - The radius of the sphere onto which the points are projected (pixel).
 * @returns The 2D screen coordinates corresponding to the projected point.
 */
export function toScreen(
    p: Projected,
    cx: number,
    cy: number,
    scale: number,
    radius: number,
): { x: number; y: number } {
    return {
        x: cx - p.x * scale * radius,
        y: cy - p.y * scale * radius,
    };
}

/**
 * From the current view parameters, computes the RA and Dec at the center (cx, cy) of the viewport.
 * @param yawDeg 
 * @param pitchDeg 
 * @returns The RA and Dec in degrees corresponding to the center of the viewport.
 */
export function viewToCenterRaDec(
    yawDeg: number,
    pitchDeg: number,
): { ra: number; dec: number } {
    const ra = wrapDeg360(yawDeg + 90);
    const dec = clamp(pitchDeg, -90, 90);
    return { ra, dec };
}
/**
 * Given a target RA and Dec, computes the view parameters (yaw and pitch) needed to center the viewport on that point.
 * @param raDeg - Target right ascension in degrees.
 * @param decDeg - Target declination in degrees.
 * @returns The yaw and pitch in degrees required to center the view on the specified RA and Dec.
 */
export function centerRaDecToView(
    ra: number,
    dec: number
): { yawDeg: number; pitchDeg: number } {
    const yawDeg = wrapDeg180(ra - 90);
    const pitchDeg = clamp(dec, -90, 90);
    return { yawDeg, pitchDeg };
}