import { Box, Input, useSlotRecipe } from "@chakra-ui/react";
import { EDITOR_EMPTY_VALUE } from "../../shared/constants";
import type { EditorIdentityModel } from "../../shared/types";
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
				{identity.isDetail ? (
					<ReadonlyFieldValue
						value={identity.labelValue || EDITOR_EMPTY_VALUE}
						tone="default"
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
