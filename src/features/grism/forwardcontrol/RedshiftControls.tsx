import { Heading, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { Slider } from "@/components/ui/slider";
import { InfoTip } from "@/components/ui/toggle-tip";
import { useGrismStore } from "@/stores/image";
import { clamp } from "@/utils/projection";

// --- Theme Constants ---
const THEME_STYLES = {
	heading: {
		size: "sm" as const,
		letterSpacing: "wide",
		fontWeight: "extrabold",
		textTransform: "uppercase" as const,
		color: { base: "gray.700", _dark: "transparent" },

		bgGradient: { base: "none", _dark: "to-r" },
		gradientFrom: { _dark: "cyan.400" },
		gradientTo: { _dark: "purple.500" },
		bgClip: { base: "border-box", _dark: "text" },
	},
};

export default function RedshiftControls() {
	const { zRedshift, setZRedshift } = useGrismStore(
		useShallow((state) => ({
			zRedshift: state.zRedshift,
			setZRedshift: state.setZRedshift,
		})),
	);

	const [maxRedshift, setMaxRedshift] = useState(12);
	const [step, setStep] = useState(0.001);
	const [localZ, setLocalZ] = useState(zRedshift || 0);

	useEffect(() => {
		setLocalZ(zRedshift || 0);
	}, [zRedshift]);

	const debouncedSetZ = useDebouncedCallback((val: number) => {
		setZRedshift(val);
	}, 10);

	const safeMax = Math.max(maxRedshift, 0);
	const safeZ = clamp(localZ, 0, safeMax);

	const handleSliderChange = ({ value }: { value: number[] }) => {
		const next = clamp(value[0] ?? 0, 0, safeMax);
		setLocalZ(next);
		debouncedSetZ(next);
	};

	const handleZInputChange = (val: number) => {
		const next = clamp(val, 0, safeMax);
		setLocalZ(next);
		debouncedSetZ(next);
	};

	return (
		<Stack gap={3}>
			<HStack align="center">
				<Heading {...THEME_STYLES.heading}>Redshift</Heading>
				<InfoTip content="Adjust the redshift (z) to shift the observed wavelength frame." />
			</HStack>

			{/* Main Slider */}
			<Stack gap={2} px={1}>
				<Slider
					label="z"
					min={0}
					max={safeMax}
					step={step}
					value={[safeZ]}
					onValueChange={handleSliderChange}
					colorPalette="cyan"
				/>
			</Stack>

			{/* Inputs Area */}
			<HStack gap={3} justify="space-between">
				<CompactNumberInput
					label="VALUE (z)"
					value={localZ}
					onChange={handleZInputChange}
					step={step}
					min={0}
					max={safeMax}
					decimalScale={4}
					labelWidth="40px"
					inputWidth="90px"
					labelPos="top"
				/>

				<CompactNumberInput
					label="STEP"
					value={step}
					onChange={(val) => val > 0 && setStep(val)}
					step={0.001}
					min={0.0001}
					decimalScale={4}
					labelWidth="40px"
					inputWidth="70px"
					labelPos="top"
				/>

				<CompactNumberInput
					label="MAX"
					value={maxRedshift}
					onChange={(val) => setMaxRedshift(val)}
					step={1}
					min={1}
					decimalScale={1}
					labelWidth="40px"
					inputWidth="60px"
					labelPos="top"
				/>
			</HStack>
		</Stack>
	);
}
