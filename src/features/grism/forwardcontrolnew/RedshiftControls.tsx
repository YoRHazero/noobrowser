import { HStack, Stack, useSlotRecipe } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { Slider } from "@/components/ui/slider";
import { SectionHeader } from "./components/SectionHeader";
import { useRedshiftControls } from "./hooks/useRedshiftControls";
import { redshiftControlsRecipe } from "./recipes/redshift-controls.recipe";

export default function RedshiftControls() {
	const {
		localZ,
		safeZ,
		safeMax,
		step,
		maxRedshift,
		setStep,
		setMaxRedshift,
		handleSliderChange,
		handleZInputChange,
	} = useRedshiftControls();

	const recipe = useSlotRecipe({ recipe: redshiftControlsRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<SectionHeader
				title="Redshift"
				tip="Adjust the redshift (z) to shift the observed wavelength frame."
			/>

			<Stack css={styles.slider}>
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

			<HStack css={styles.inputs}>
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
