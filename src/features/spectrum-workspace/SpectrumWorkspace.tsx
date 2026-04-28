"use client";

import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import Spectrum1DCanvas from "@/canvas/spectrum1dCanvas";
import Spectrum2DCanvas from "@/canvas/spectrum2dCanvas";
import { SpectrumWorkspaceSidebar } from "./parts/SpectrumWorkspaceSidebar";
import { spectrumWorkspaceRecipe } from "./SpectrumWorkspace.recipe";
import SpectrumWorkspaceEmissionLines from "./subfeatures/emission-lines";
import SpectrumWorkspaceHud from "./subfeatures/hud";
import SpectrumWorkspaceLineFit from "./subfeatures/line-fit";
import { useSpectrumWorkspace } from "./useSpectrumWorkspace";

export default function SpectrumWorkspace() {
	const recipe = useSlotRecipe({ recipe: spectrumWorkspaceRecipe });
	const styles = recipe();
	const workspace = useSpectrumWorkspace();

	return (
		<Box css={styles.root}>
			{workspace.state === "ready" ? (
				<Box css={styles.body}>
					<Box css={styles.mainPane}>
						<Box css={styles.spectrum2dPane}>
							<Box css={styles.spectrum2dCanvasFrame}>
								<Spectrum2DCanvas
									model={workspace.spectrum2d.model}
									actions={workspace.spectrum2d.actions}
								/>
							</Box>
							<SpectrumWorkspaceHud />
						</Box>

						<Box css={styles.spectrum1dPane}>
							<Spectrum1DCanvas
								model={workspace.spectrum1d.model}
								actions={workspace.spectrum1d.actions}
							/>
						</Box>
					</Box>

					<Box css={styles.sidebarPane}>
						<SpectrumWorkspaceSidebar
							{...workspace.sidebar}
							linesSection={<SpectrumWorkspaceEmissionLines />}
							fitSection={<SpectrumWorkspaceLineFit />}
						/>
					</Box>
				</Box>
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
