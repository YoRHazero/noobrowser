import { Stack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { editorViewRecipe } from "./EditorView.recipe";
import { EditorHeader } from "./parts/EditorHeader";
import { FootprintSection } from "./parts/FootprintSection";
import { IdentitySection } from "./parts/IdentitySection";
import { ImagePositionSection } from "./parts/ImagePositionSection";
import { SkyPositionSection } from "./parts/SkyPositionSection";
import { SpectrumSection } from "./parts/SpectrumSection";
import type { EditorViewModel } from "./useEditor";

type EditorViewProps = EditorViewModel & {
	detailActionAddon?: ReactNode;
};

export function EditorView({
	header,
	identity,
	skyPosition,
	imagePosition,
	footprint,
	extraction,
	spectrum,
	actions,
	detailActionAddon,
}: EditorViewProps) {
	const recipe = useSlotRecipe({ recipe: editorViewRecipe });
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
				detailActionAddon={detailActionAddon}
			/>
		</Stack>
	);
}
