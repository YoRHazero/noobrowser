export function formatAmplitude(val: number | null, err: number | null) {
	if (val === null) return "-";
	if (val === 0) return "0";

	const exp = Math.floor(Math.log10(Math.abs(val)));
	const valScaled = val / 10 ** exp;
	
	if (err === null) {
		return `${valScaled.toFixed(2)} \\times 10^{${exp}}`;
	}

	const errScaled = err / 10 ** exp;
	return `(${valScaled.toFixed(2)} \\pm ${errScaled.toFixed(2)}) \\times 10^{${exp}}`;
}
