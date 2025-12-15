export function generateColor(index: number): string {
    const angle = index * 137.508; // degrees
    const hue = angle % 360;
    return `hsl(${hue}, 85%, 60%)`;
}