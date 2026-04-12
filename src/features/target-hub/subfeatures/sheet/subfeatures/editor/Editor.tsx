"use client";

import { Stack, useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { editorRecipe } from "./Editor.recipe";
import { EditorActionBar } from "./parts/EditorActionBar";
import { EditorHeader } from "./parts/EditorHeader";
import { FootprintSection } from "./parts/FootprintSection";
import { IdentitySection } from "./parts/IdentitySection";
import { ImagePositionSection } from "./parts/ImagePositionSection";
import { SkyPositionSection } from "./parts/SkyPositionSection";
import { useEditor } from "./useEditor";

interface EditorProps {
	detailActionAddon?: ReactNode;
}

export default function Editor({ detailActionAddon }: EditorProps) {
	const viewModel = useEditor();
	const recipe = useSlotRecipe({ recipe: editorRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.currentCard}>
			<EditorHeader header={viewModel.header} />
			<IdentitySection identity={viewModel.identity} />
			<SkyPositionSection skyPosition={viewModel.skyPosition} />
			<FootprintSection
				footprint={viewModel.footprint}
				imagePosition={viewModel.imagePosition}
			/>
			<ImagePositionSection imagePosition={viewModel.imagePosition} />
			<EditorActionBar
				header={viewModel.header}
				extraction={viewModel.extraction}
				spectrum={viewModel.spectrum}
				actions={viewModel.actions}
				detailActionAddon={detailActionAddon}
			/>
		</Stack>
	);
}
