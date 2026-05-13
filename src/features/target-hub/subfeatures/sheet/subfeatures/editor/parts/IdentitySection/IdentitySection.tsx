import { Box, Input, useSlotRecipe } from "@chakra-ui/react";
import type { EditorIdentityModel } from "../../hooks/editorModels";
import { EDITOR_EMPTY_VALUE } from "../../shared/constants";
import { EditorField } from "../EditorField";
import { ReadonlyFieldValue } from "../ReadonlyFieldValue";
import { identitySectionRecipe } from "./IdentitySection.recipe";

interface IdentitySectionProps {
	identity: EditorIdentityModel;
}

export function IdentitySection({ identity }: IdentitySectionProps) {
	const recipe = useSlotRecipe({ recipe: identitySectionRecipe });
	const styles = recipe();

	return (
		<Box css={styles.editorRow}>
			<EditorField label="ID">
				<ReadonlyFieldValue
					value={identity.idValue}
					tone={identity.isDetail ? "default" : "muted"}
				/>
			</EditorField>
			<EditorField label="Label">
				<Input
					aria-label="Source label"
					value={identity.labelValue}
					placeholder={EDITOR_EMPTY_VALUE}
					css={styles.editableField}
					onChange={(event) => identity.onLabelChange(event.target.value)}
					onBlur={identity.onLabelBlur}
				/>
			</EditorField>
		</Box>
	);
}
