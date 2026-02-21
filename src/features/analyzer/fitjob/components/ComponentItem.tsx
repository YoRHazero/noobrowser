import { Box, Text } from "@chakra-ui/react";
import Latex from "@/components/ui/latex";
import type { ComponentSummary } from "@/hooks/query/fit/schemas";
import { formatAmplitude } from "./utils";

export function ComponentItem({
	comp,
	styles,
}: {
	comp: ComponentSummary;
	styles: Record<string, any>;
}) {
	return (
		<Box css={styles.componentItem}>
			<Text css={styles.componentName}>
				{comp.name} <Text as="span" css={styles.componentType}>({comp.component_type})</Text>
			</Text>
			<Box css={styles.grid}>
				{comp.center !== null && (
					<Box>
						<Text css={styles.gridLabel}>Center</Text>
						<Text css={styles.gridValue}>
							{comp.center.toFixed(4)}
							{comp.center_error !== null && ` ± ${comp.center_error.toFixed(4)}`}
						</Text>
					</Box>
				)}
				{comp.amplitude !== null && (
					<Box>
						<Text css={styles.gridLabel}>Amp</Text>
						<Text css={styles.gridValue}>
							<Latex>{formatAmplitude(comp.amplitude, comp.amplitude_error)}</Latex>
						</Text>
					</Box>
				)}
				{comp.fwhm_kms !== null && (
					<Box>
						<Text css={styles.gridLabel}>FWHM (km/s)</Text>
						<Text css={styles.gridValue}>
							{comp.fwhm_kms.toFixed(1)}
							{comp.fwhm_kms_error !== null &&
								` ± ${comp.fwhm_kms_error.toFixed(1)}`}
						</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
}
