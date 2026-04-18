"use client";

import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import Spectrum1DCanvas from "@/canvas/spectrum1dCanvas";
import Spectrum2DCanvas from "@/canvas/spectrum2dCanvas";
import { spectrumWorkspaceRecipe } from "./SpectrumWorkspace.recipe";
import { useSpectrumWorkspace } from "./useSpectrumWorkspace";

export default function SpectrumWorkspace() {
	const recipe = useSlotRecipe({ recipe: spectrumWorkspaceRecipe });
	const styles = recipe();
	const workspace = useSpectrumWorkspace();

	return (
		<Box css={styles.root}>
			{workspace.state === "ready" ? (
				<>
					<Box css={styles.spectrum2dPane}>
						<Spectrum2DCanvas
							model={workspace.spectrum2d.model}
							actions={workspace.spectrum2d.actions}
						/>
					</Box>
					<Box css={styles.spectrum1dPane}>
						<Spectrum1DCanvas
							model={workspace.spectrum1d.model}
							actions={workspace.spectrum1d.actions}
						/>
					</Box>
				</>
			) : (
				<Box css={styles.message}>
					<Text css={styles.messageTitle}>{workspace.message}</Text>
					{workspace.detail ? (
						<Text css={styles.messageDetail}>{workspace.detail}</Text>
					) : null}
				</Box>
			)}
		</Box>
	);
}
