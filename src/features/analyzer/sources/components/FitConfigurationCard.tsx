import {
	Card,
	Checkbox,
	HStack,
	IconButton,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { LuSettings2 } from "react-icons/lu";
import type { FitConfiguration } from "@/stores/stores-types";
import { fitConfigurationCardRecipe } from "../recipes/fit-configuration-card.recipe";

interface FitConfigurationCardProps {
	config: FitConfiguration;
	onToggle: (id: string) => void;
	onOpenPrior: (id: string) => void;
	onRemove: (id: string) => void;
}

export default function FitConfigurationCard({
	config,
	onToggle,
	onOpenPrior,
	onRemove,
}: FitConfigurationCardProps) {
	const recipe = useSlotRecipe({ recipe: fitConfigurationCardRecipe });
	const styles = recipe({ selected: config.selected });

	return (
		<Card.Root css={styles.root} onClick={() => onToggle(config.id)}>
			<Card.Body css={styles.body}>
				<Stack gap={2}>
					<HStack justify="space-between" align="start">
						<Text css={styles.name} title={config.name}>
							{config.name}
						</Text>
						<Checkbox.Root
							checked={config.selected}
							size="xs"
							pointerEvents="none"
							colorPalette="cyan"
						>
							<Checkbox.HiddenInput />
							<Checkbox.Control css={styles.checkbox} />
						</Checkbox.Root>
					</HStack>

					<HStack justify="space-between" align="center">
						<Text css={styles.meta}>{config.models.length} MODELS</Text>

						<HStack css={styles.actionGroup}>
							<IconButton
								aria-label="Configure Prior"
								size="xs"
								variant="ghost"
								css={styles.actionButton}
								onClick={(event) => {
									event.stopPropagation();
									onOpenPrior(config.id);
								}}
							>
								<LuSettings2 size={12} />
							</IconButton>

							<IconButton
								aria-label="Delete config"
								size="xs"
								variant="ghost"
								css={styles.removeButton}
								onClick={(event) => {
									event.stopPropagation();
									onRemove(config.id);
								}}
							>
								<Trash2 size={12} />
							</IconButton>
						</HStack>
					</HStack>
				</Stack>
			</Card.Body>
		</Card.Root>
	);
}
