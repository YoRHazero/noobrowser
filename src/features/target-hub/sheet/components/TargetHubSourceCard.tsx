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
import { formatPositionValue, getSourceDisplayName } from "../utils";
import { sheetRecipe } from "../recipes/sheet.recipe";
import { TargetHubSourceProjectionControls } from "./TargetHubSourceProjectionControls";

interface TargetHubSourceCardProps {
	source: Source;
	isActive: boolean;
	onSelect: () => void;
	onToggleOverview: () => void;
	onToggleInspector: () => void;
	onDelete: () => void;
}

export function TargetHubSourceCard({
	source,
	isActive,
	onSelect,
	onToggleOverview,
	onToggleInspector,
	onDelete,
}: TargetHubSourceCardProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();
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
			css={{
				...styles.sourceCard,
				cursor: "pointer",
				borderColor: isActive ? "cyan.300" : styles.sourceCard.borderColor,
				bg: isActive ? "rgba(34, 211, 238, 0.10)" : styles.sourceCard.bg,
			}}
			onClick={onSelect}
			onKeyDown={handleKeyDown}
		>
			<Box
				css={styles.sourceIndicator}
				style={
					{
						backgroundColor: source.color,
						boxShadow: `0 0 16px ${source.color}`,
					} as CSSProperties
				}
			/>

			<Stack gap={1} minW={0} flex="1" align="flex-start">
				<Text fontSize="sm" fontWeight="semibold" color="white">
					{displayName}
				</Text>
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
				alignSelf="center"
			>
				<TargetHubSourceProjectionControls
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
