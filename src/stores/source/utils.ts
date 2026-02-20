/**
 * Generate a distinct color based on the given index.
 * Uses the golden angle to ensure good distribution.
 * @param index - The index to generate the color for.
 * @returns A string representing the color in HSL format.
 */
export function generateColor(index: number): string {
	const angle = index * 137.508; // degrees
	const hue = angle % 360;
	return `hsl(${hue}, 85%, 60%)`;
}
