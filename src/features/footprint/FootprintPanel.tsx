import {
	Badge,
	Box,
	Button,
	createListCollection,
	HStack,
	Select,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGlobeAnimation } from "@/hook/animation-hook";
import { useGlobeStore } from "@/stores/footprints";
import type { Footprint } from "@/stores/stores-types";
import { centerRaDecToView } from "@/utils/projection";

type Rows = {
	fp: Footprint;
	center: { ra: number; dec: number };
	included_files: string[];
	current: string;
	collection: ReturnType<
		typeof createListCollection<{ label: string; value: string }>
	>;
};

export default function FootprintPanel() {
	const { animateToView } = useGlobeAnimation();
	const {
		footprints,
		selectedFootprintId,
		setSelectedFootprintId,
		setFootprintMeta,
	} = useGlobeStore(
		useShallow((state) => ({
			footprints: state.footprints,
			selectedFootprintId: state.selectedFootprintId,
			setSelectedFootprintId: state.setSelectedFootprintId,
			setFootprintMeta: state.setFootprintMeta,
			setView: state.setView,
		})),
	);

	const rows = useMemo<Rows[]>(() => {
		return footprints.map((fp) => {
			const center = fp.meta?.center;
			const included_files: string[] = fp.meta?.included_files || [];
			const selectedFromMeta = fp.meta?.selected_file as string | undefined;
			const current =
				(selectedFromMeta && included_files.includes(selectedFromMeta)
					? selectedFromMeta
					: undefined) ??
				included_files[0] ??
				"";

			const collection = createListCollection({
				items: included_files.map((name) => ({ label: name, value: name })),
			});
			return { fp, center, included_files, current, collection };
		});
	}, [footprints]);

	const toggleSelect = (id: string) => {
		setSelectedFootprintId(selectedFootprintId === id ? null : id);
	};

	if (footprints.length === 0) {
		return (
			<Box p={3}>
				<Text color="fg.muted">No footprints loaded.</Text>
			</Box>
		);
	}

	return (
		<Stack gap={3} p={3}>
			{rows.map(({ fp, center, included_files, current, collection }) => {
				const isSelected = selectedFootprintId === fp.id;
				return (
					<Box
						key={fp.id}
						rounded="md"
						borderWidth="1px"
						borderColor={isSelected ? "blue.400" : "border.subtle"}
						bg={isSelected ? "blue.subtle" : "transparent"}
						_hover={{ bg: isSelected ? "blue.subtle" : "bg.muted" }}
						cursor="pointer"
						onClick={() => toggleSelect(fp.id)}
						transition="background 0.15s ease"
					>
						{/* Header and status */}
						<HStack justify="space-between" p={2} pe={3}>
							<Text fontWeight="medium">{fp.id}</Text>
							<Badge colorPalette={isSelected ? "blue" : "gray"}>
								{isSelected ? "Selected" : "Select"}
							</Badge>
						</HStack>

						{/* info */}
						<HStack px={3} pb={2} wrap="wrap" gap={3}>
							<Text fontSize="sm" color="fg.muted">
								RA: {Number.isFinite(center?.ra) ? center.ra.toFixed(5) : "--"}°
							</Text>
							<Text fontSize="sm" color="fg.muted">
								Dec:{" "}
								{Number.isFinite(center?.dec) ? center.dec.toFixed(5) : "--"}°
							</Text>
						</HStack>

						{/* selected part */}
						<Box px={3} pb={2} onClick={(e) => e.stopPropagation()}>
							{included_files.length > 0 ? (
								<Select.Root
									collection={collection}
									size="sm"
									width="100%"
									value={current ? [current] : []}
									disabled={!isSelected}
									onValueChange={({ value }) =>
										setFootprintMeta(fp.id, "selected_file", value?.[0] ?? null)
									}
									positioning={{ sameWidth: true }}
								>
									<Select.HiddenSelect />
									<Select.Label>File to show</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText placeholder="No items" />
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Select.Positioner>
										<Select.Content>
											{collection.items.map((item) => (
												<Select.Item key={item.value} item={item}>
													{item.label}
													<Select.ItemIndicator />
												</Select.Item>
											))}
										</Select.Content>
									</Select.Positioner>
								</Select.Root>
							) : (
								<Text fontSize="sm" color="fg.muted">
									No included files
								</Text>
							)}
						</Box>

						{/* button area */}
						<HStack p={3} pt={1} gap={2} justify="flex-end">
							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									if (center) {
										const { yawDeg, pitchDeg } = centerRaDecToView(
											center.ra,
											center.dec,
										);
										animateToView(yawDeg, pitchDeg, 200);
									}
								}}
							>
								Goto
							</Button>
						</HStack>
					</Box>
				);
			})}
		</Stack>
	);
}
