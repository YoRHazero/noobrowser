import {
	Box,
	HStack,
	IconButton,
	Input,
	Stack,
	Switch,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { SlidersHorizontal, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitConfigurationCardModel } from "../../useSpectrumWorkspaceLineFit";
import { fitConfigurationCardRecipe } from "./FitConfigurationCard.recipe";

export function FitConfigurationCard({
	id,
	name,
	selected,
	includedInJob,
	modelSummary,
	onSelect,
	onDelete,
	onRename,
	onOpenPriors,
	onToggleIncludedInJob,
}: FitConfigurationCardModel) {
	const recipe = useSlotRecipe({ recipe: fitConfigurationCardRecipe });
	const styles = recipe({ selected });

	return (
		<Box
			role="button"
			tabIndex={0}
			css={styles.root}
			onClick={() => onSelect(id)}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onSelect(id);
				}
			}}
		>
			<Stack css={styles.body}>
				<HStack css={styles.header}>
					<Input
						size="2xs"
						value={name}
						css={styles.nameInput}
						onClick={(event) => event.stopPropagation()}
						onKeyDown={(event) => event.stopPropagation()}
						onChange={(event) => onRename(id, event.currentTarget.value)}
					/>
					<Tooltip content="Configure priors">
						<Box
							css={styles.controlWrap}
							onClick={(event) => event.stopPropagation()}
							onKeyDown={(event) => event.stopPropagation()}
						>
							<IconButton
								aria-label={`Configure priors for ${name}`}
								size="2xs"
								variant="ghost"
								css={styles.priorButton}
								onClick={() => onOpenPriors(id)}
							>
								<SlidersHorizontal size={13} />
							</IconButton>
						</Box>
					</Tooltip>
					<Tooltip content="Delete configuration">
						<IconButton
							aria-label={`Delete ${name}`}
							size="2xs"
							variant="ghost"
							css={styles.deleteButton}
							onClick={(event) => {
								event.stopPropagation();
								onDelete(id);
							}}
						>
							<Trash2 size={13} />
						</IconButton>
					</Tooltip>
				</HStack>
				<HStack css={styles.metaRow}>
					<Stack css={styles.metaStack}>
						<Text css={styles.summaryText}>{modelSummary}</Text>
						<Text css={styles.stateText}>{selected ? "Editing" : "Saved"}</Text>
					</Stack>
					<Tooltip
						content={
							includedInJob
								? "Remove from MCMC submission"
								: "Include in MCMC submission"
						}
					>
						<HStack
							css={styles.jobToggle}
							onClick={(event) => event.stopPropagation()}
							onKeyDown={(event) => event.stopPropagation()}
						>
							<Text css={styles.jobLabel}>MCMC</Text>
							<Switch.Root
								size="sm"
								checked={includedInJob}
								onCheckedChange={() => onToggleIncludedInJob(id)}
							>
								<Switch.HiddenInput />
								<Switch.Control css={styles.switchControl}>
									<Switch.Thumb />
								</Switch.Control>
							</Switch.Root>
						</HStack>
					</Tooltip>
				</HStack>
			</Stack>
		</Box>
	);
}
