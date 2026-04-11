import { Stack, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../recipes/sheet.recipe";
import { EditorHeader } from "./components/EditorHeader";
import { FootprintSection } from "./components/FootprintSection";
import { IdentitySection } from "./components/IdentitySection";
import { ImagePositionSection } from "./components/ImagePositionSection";
import { SkyPositionSection } from "./components/SkyPositionSection";
import { SpectrumSection } from "./components/SpectrumSection";
import type { EditorViewModel } from "./useEditor";

type EditorViewProps = EditorViewModel;

export function EditorView({
	header,
	identity,
	skyPosition,
	imagePosition,
	footprint,
	extraction,
	spectrum,
	actions,
}: EditorViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.currentCard}>
			<EditorHeader header={header} />
			<IdentitySection identity={identity} />
			<SkyPositionSection skyPosition={skyPosition} />
			<FootprintSection footprint={footprint} imagePosition={imagePosition} />
			<ImagePositionSection imagePosition={imagePosition} />
			<SpectrumSection
				header={header}
				extraction={extraction}
				spectrum={spectrum}
				actions={actions}
			/>
		</Stack>
	);
}
