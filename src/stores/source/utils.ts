/**
 * Generate a stable color from the source id.
 * Only the hue varies so saturation/lightness stay visually consistent.
 * @param id - The source id to hash into a hue.
 * @returns A string representing the color in HSL format.
 */
export function generateColor(id: string): string {
	let hash = 2166136261;

	for (let index = 0; index < id.length; index += 1) {
		hash ^= id.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	const hue = (hash >>> 0) % 360;
	return `hsl(${hue}, 85%, 60%)`;
}

const RA_CENTISECONDS_PER_DEGREE = 24_000;
const RA_CENTISECONDS_PER_DAY = 8_640_000;
const DEC_TENTHS_ARCSECONDS_PER_DEGREE = 36_000;
const DEC_TENTHS_ARCSECONDS_MAX = 3_240_000;

function padInteger(value: number, width: number) {
	return String(value).padStart(width, "0");
}

function normalizeRaDegrees(ra: number) {
	const normalized = ra % 360;
	return normalized < 0 ? normalized + 360 : normalized;
}

function formatRaForJName(ra: number) {
	const totalCentiseconds =
		Math.round(normalizeRaDegrees(ra) * RA_CENTISECONDS_PER_DEGREE) %
		RA_CENTISECONDS_PER_DAY;
	const hours = Math.floor(totalCentiseconds / 360_000);
	const minutes = Math.floor((totalCentiseconds % 360_000) / 6_000);
	const seconds = ((totalCentiseconds % 6_000) / 100).toFixed(2);

	return `${padInteger(hours, 2)}${padInteger(minutes, 2)}${seconds.padStart(5, "0")}`;
}

function formatDecForJName(dec: number) {
	const sign = dec >= 0 ? "+" : "-";
	const totalTenthsArcseconds = Math.round(
		Math.abs(dec) * DEC_TENTHS_ARCSECONDS_PER_DEGREE,
	);
	const degrees = Math.floor(totalTenthsArcseconds / 36_000);
	const minutes = Math.floor((totalTenthsArcseconds % 36_000) / 600);
	const seconds = ((totalTenthsArcseconds % 600) / 10).toFixed(1);

	return `${sign}${padInteger(degrees, 2)}${padInteger(minutes, 2)}${seconds.padStart(4, "0")}`;
}

export function generateSourceBaseId(ra: number, dec: number): string {
	if (!Number.isFinite(ra)) {
		throw new Error("Source RA must be a finite number");
	}
	if (!Number.isFinite(dec)) {
		throw new Error("Source Dec must be a finite number");
	}
	if (dec < -90 || dec > 90) {
		throw new Error("Source Dec must be within [-90, 90]");
	}

	const totalTenthsArcseconds = Math.round(
		Math.abs(dec) * DEC_TENTHS_ARCSECONDS_PER_DEGREE,
	);
	if (totalTenthsArcseconds > DEC_TENTHS_ARCSECONDS_MAX) {
		throw new Error("Source Dec is out of range after rounding");
	}

	return `J${formatRaForJName(ra)}${formatDecForJName(dec)}`;
}

export function generateSourceId(
	ra: number,
	dec: number,
	existingIds: Iterable<string>,
): string {
	const baseId = generateSourceBaseId(ra, dec);
	const existingIdSet =
		existingIds instanceof Set ? existingIds : new Set(existingIds);

	if (!existingIdSet.has(baseId)) {
		return baseId;
	}

	let suffix = 2;
	let candidate = `${baseId}-${suffix}`;
	while (existingIdSet.has(candidate)) {
		suffix += 1;
		candidate = `${baseId}-${suffix}`;
	}

	return candidate;
}
