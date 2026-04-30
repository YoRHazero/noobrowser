import type { SpectrumPanelPoint, SpectrumPanelScales } from "../shared/types";

export function createStepLinePath(
	points: SpectrumPanelPoint[],
	scales: SpectrumPanelScales,
): string {
	if (points.length === 0) {
		return "";
	}

	const commands: string[] = [];
	points.forEach((point, index) => {
		const x = scales.xForVelocity(point.velocityKmS);
		const y = scales.yForValue(point.value);
		if (index === 0) {
			commands.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
			return;
		}

		const previous = points[index - 1];
		const previousY = scales.yForValue(previous.value);
		commands.push(`H ${x.toFixed(2)} V ${y.toFixed(2)}`);
		if (previousY !== y) {
			commands[commands.length - 1] = `H ${x.toFixed(2)} V ${y.toFixed(2)}`;
		}
	});

	return commands.join(" ");
}

export function createStepErrorPath(
	points: SpectrumPanelPoint[],
	scales: SpectrumPanelScales,
): string | null {
	if (!points.some((point) => point.error !== undefined)) {
		return null;
	}

	const upper = points.map((point, index) => {
		const x = scales.xForVelocity(point.velocityKmS);
		const y = scales.yForValue(point.value + (point.error ?? 0));
		return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
	});
	const lower = points
		.map((point) => {
			const x = scales.xForVelocity(point.velocityKmS);
			const y = scales.yForValue(point.value - (point.error ?? 0));
			return `L ${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.reverse();

	return `${upper.join(" ")} ${lower.join(" ")} Z`;
}

export function createTicks(min: number, max: number, count: number): number[] {
	if (!Number.isFinite(min) || !Number.isFinite(max) || count <= 1) {
		return [];
	}

	if (min === max) {
		return [min];
	}

	const step = (max - min) / (count - 1);
	return Array.from({ length: count }, (_, index) => min + step * index);
}
