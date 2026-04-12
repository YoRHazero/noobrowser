import { Box, Button, HStack, Text, useSlotRecipe } from "@chakra-ui/react";
import { ArrowLeft, Plus } from "lucide-react";
import type { EditorHeaderModel } from "../../hooks/useEditorHeaderModel";
import { editorHeaderRecipe } from "./EditorHeader.recipe";

interface EditorHeaderProps {
	header: EditorHeaderModel;
}

export function EditorHeader({ header }: EditorHeaderProps) {
	const recipe = useSlotRecipe({ recipe: editorHeaderRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.editorHeader}>
			<Box>
				<Text fontSize="sm" fontWeight="semibold" color="white">
					{header.isDetail ? "Current Source" : "Create Source"}
				</Text>
			</Box>

			<HStack css={styles.editorHeaderActions}>
				{header.canReturn ? (
					<Button
						type="button"
						size="xs"
						variant="ghost"
						onClick={header.onReturnToDetailMode}
					>
						<ArrowLeft size={14} />
						Back
					</Button>
				) : null}
				{header.isDetail ? (
					<Button
						type="button"
						size="xs"
						variant="outline"
						onClick={header.onEnterCreateMode}
					>
						<Plus size={14} />
						New
					</Button>
				) : null}
			</HStack>
		</HStack>
	);
}
