import { Box, Input, useSlotRecipe } from "@chakra-ui/react";
import { sheetRecipe } from "../../recipes/sheet.recipe";
import type { EditorIdentityModel } from "../hooks/useEditorIdentityModel";
import { EditorField } from "./EditorField";
import { ReadonlyFieldValue } from "./ReadonlyFieldValue";

interface IdentitySectionProps {
	identity: EditorIdentityModel;
}

export function IdentitySection({ identity }: IdentitySectionProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Box css={styles.editorRow}>
			<EditorField label="ID">
				<ReadonlyFieldValue
					value={identity.idValue}
					color={identity.isDetail ? "white" : "whiteAlpha.720"}
				/>
			</EditorField>
			<EditorField label="Label">
				{identity.isDetail ? (
					<ReadonlyFieldValue
						value={identity.labelValue || "—"}
						color="white"
					/>
				) : (
					<Input
						aria-label="Source label"
						value={identity.draftLabel}
						placeholder="Optional"
						css={styles.editableField}
						onChange={(event) => identity.onLabelChange(event.target.value)}
					/>
				)}
			</EditorField>
		</Box>
	);
}
