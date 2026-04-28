import { Box, HStack, IconButton, SegmentGroup } from "@chakra-ui/react";
import { Plus, RefreshCw, WandSparkles } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { LineFitModelKind } from "../store";
import type { FitToolbarModel } from "../useSpectrumWorkspaceLineFit";

const modelKindItems: { label: string; value: LineFitModelKind }[] = [
	{ label: "Gaussian", value: "gaussian" },
	{ label: "Linear", value: "linear" },
];

export function FitToolbar({
	modelKind,
	canAddModel,
	canSyncModels,
	onModelKindChange,
	onAddModel,
	onSyncModels,
}: FitToolbarModel) {
	return (
		<HStack gap={2} w="full" align="center">
			<SegmentGroup.Root
				size="xs"
				value={modelKind}
				flex="1"
				minW={0}
				onValueChange={({ value }) => {
					if (value === "gaussian" || value === "linear") {
						onModelKindChange(value);
					}
				}}
			>
				<SegmentGroup.Indicator />
				{modelKindItems.map((item) => (
					<SegmentGroup.Item key={item.value} value={item.value} flex="1">
						<SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
						<SegmentGroup.ItemHiddenInput />
					</SegmentGroup.Item>
				))}
			</SegmentGroup.Root>

			<HStack gap={1} flex="0 0 auto">
				<Tooltip
					content={
						canAddModel
							? "Add model to selected configuration"
							: "Select a configuration before adding a model"
					}
				>
					<Box display="inline-flex">
						<IconButton
							aria-label="Add fit model"
							size="xs"
							variant="outline"
							disabled={!canAddModel}
							onClick={onAddModel}
						>
							<Plus size={14} />
						</IconButton>
					</Box>
				</Tooltip>
				<Tooltip
					content={
						canSyncModels
							? "Sync model ranges and centers to current slice"
							: "Select a configuration before syncing models"
					}
				>
					<Box display="inline-flex">
						<IconButton
							aria-label="Sync fit models to current slice"
							size="xs"
							variant="outline"
							disabled={!canSyncModels}
							onClick={onSyncModels}
						>
							<RefreshCw size={14} />
						</IconButton>
					</Box>
				</Tooltip>
				<Tooltip content="Guess is reserved for a later fitting pass">
					<Box display="inline-flex">
						<IconButton
							aria-label="Guess fit model parameters"
							size="xs"
							variant="outline"
							disabled
						>
							<WandSparkles size={14} />
						</IconButton>
					</Box>
				</Tooltip>
			</HStack>
		</HStack>
	);
}
