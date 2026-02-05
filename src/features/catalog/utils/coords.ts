function pad2(n: number) {
	return String(n).padStart(2, "0");
}

export function ra2hms(raDeg: number) {
	const ra = ((raDeg % 360) + 360) % 360;
	const totalHours = ra / 15;
	const h = Math.floor(totalHours);
	const totalMinutes = (totalHours - h) * 60;
	const m = Math.floor(totalMinutes);
	const s = (totalMinutes - m) * 60;
	return `${pad2(h)}:${pad2(m)}:${s.toFixed(2).padStart(5, "0")}`;
}

export function dec2dms(decDeg: number) {
	const sign = decDeg < 0 ? "-" : "+";
	const abs = Math.abs(decDeg);
	const d = Math.floor(abs);
	const totalMinutes = (abs - d) * 60;
	const m = Math.floor(totalMinutes);
	const s = (totalMinutes - m) * 60;
	return `${sign}${pad2(d)}:${pad2(m)}:${s.toFixed(2).padStart(5, "0")}`;
}
