import {
	Box,
	HStack,
	IconButton,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { CSSProperties, KeyboardEvent } from "react";
import { LuTrash2 } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import type { Source } from "@/stores/source";
import { ProjectionControls } from "../../../../parts/ProjectionControls";
import { formatPositionValue, getSourceDisplayName } from "../../../../utils";
import { sourceCardRecipe } from "./SourceCard.recipe";

interface SourceCardProps {
	source: Source;
	isActive: boolean;
	onSelect: () => void;
	onToggleOverview: () => void;
	onToggleInspector: () => void;
	onDelete: () => void;
}

export function SourceCard({
	source,
	isActive,
	onSelect,
	onToggleOverview,
	onToggleInspector,
	onDelete,
}: SourceCardProps) {
	const recipe = useSlotRecipe({ recipe: sourceCardRecipe });
	const styles = recipe({ isActive });
	const displayName = getSourceDisplayName(source);

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		onSelect();
	};

	return (
		<Box
			role="button"
			tabIndex={0}
			css={styles.sourceCard}
			onClick={onSelect}
			onKeyDown={handleKeyDown}
		>
			<Box
				css={styles.sourceIndicator}
				style={
					{
						"--source-color": source.color,
					} as CSSProperties
				}
			/>

			<Stack css={styles.sourceBody}>
				<Text css={styles.sourceTitle}>{displayName}</Text>
				<Text css={styles.helperText}>ID: {source.id}</Text>
				<Text css={styles.helperText}>
					RA/Dec: {formatPositionValue(source.position.ra, 5)} /{" "}
					{formatPositionValue(source.position.dec, 5)}
				</Text>
				<Text css={styles.helperText}>
					X/Y: {formatPositionValue(source.position.x, 1)} /{" "}
					{formatPositionValue(source.position.y, 1)}
				</Text>
				<Text css={styles.helperText}>
					Ref: {source.imageRef.refBasename ?? "—"}
				</Text>
			</Stack>

			<HStack
				css={styles.sourceControls}
				onClick={(event) => event.stopPropagation()}
			>
				<ProjectionControls
					isOverviewVisible={source.visibility.overview}
					isInspectorVisible={source.visibility.inspector}
					onToggleOverview={onToggleOverview}
					onToggleInspector={onToggleInspector}
				/>
				<Tooltip content="Delete Source" showArrow>
					<IconButton
						type="button"
						aria-label={`Delete ${displayName}`}
						size="xs"
						variant="ghost"
						css={styles.chip}
						onClick={onDelete}
					>
						<LuTrash2 />
					</IconButton>
				</Tooltip>
			</HStack>
		</Box>
	);
}
