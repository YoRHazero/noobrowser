import {
	Badge,
	Box,
	Card,
	Checkbox,
	HStack,
	IconButton,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";
import GrismForwardPriorDrawer from "@/features/grism/GrismForwardPriorDrawer";
import { useFitStore } from "@/stores/fit";

// --- Theme Constants ---
const THEME_STYLES = {
	heading: {
		size: "sm" as const,
		letterSpacing: "wide",
		fontWeight: "extrabold",
		textTransform: "uppercase" as const,
		color: { base: "gray.700", _dark: "transparent" },
		bgGradient: { base: "none", _dark: "to-r" },
		gradientFrom: { _dark: "cyan.400" },
		gradientTo: { _dark: "purple.500" },
		bgClip: { base: "border-box", _dark: "text" },
	},
	scrollArea: {
		overflowX: "auto" as const,
		whiteSpace: "nowrap" as const,
		pb: 4,
		px: 1,
		css: {
			"&::-webkit-scrollbar": { height: "4px" },
			"&::-webkit-scrollbar-track": { background: "transparent" },
			"&::-webkit-scrollbar-thumb": {
				background: "var(--chakra-colors-whiteAlpha-200)",
				borderRadius: "full",
			},
			"&::-webkit-scrollbar-thumb:hover": {
				background: "var(--chakra-colors-whiteAlpha-400)",
			},
		},
	},
	cardRoot: (selected: boolean) => ({
		size: "sm" as const,
		minW: "160px",
		variant: "outline" as const,
		cursor: "pointer",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // 更平滑的过渡

		borderColor: selected
			? { base: "cyan.500", _dark: "cyan.500" }
			: "border.subtle",
		bg: selected ? { base: "cyan.50", _dark: "whiteAlpha.100" } : "bg.panel",

		boxShadow: selected
			? {
					base: "0 0 0 1px var(--chakra-colors-cyan-500)",
					_dark: "0 0 10px rgba(6, 182, 212, 0.15)",
				}
			: "none",

		_hover: {
			borderColor: "cyan.400",

			bg: selected
				? { base: "cyan.100", _dark: "whiteAlpha.200" }
				: { base: "gray.50", _dark: "whiteAlpha.100" },

			boxShadow: selected
				? {
						base: "0 0 0 2px var(--chakra-colors-cyan-400), 0 4px 12px rgba(6, 182, 212, 0.3)",
						_dark:
							"0 0 15px rgba(6, 182, 212, 0.5), 0 0 2px var(--chakra-colors-cyan-400)",
					}
				: {
						base: "0 2px 8px rgba(0, 0, 0, 0.08)",
						_dark: "0 0 12px rgba(255, 255, 255, 0.1)",
					},

			transform: "none",
			zIndex: 1,
		},
	}),
};

export default function FitConfigurationList() {
	const { configurations, toggleConfigurationSelection, removeConfiguration } =
		useFitStore(
			useShallow((s) => ({
				configurations: s.configurations,
				toggleConfigurationSelection: s.toggleConfigurationSelection,
				removeConfiguration: s.removeConfiguration,
			})),
		);

	const [editingId, setEditingId] = useState<string | null>(null);

	return (
		<Stack gap={3} flexShrink={0}>
			{/* Header */}
			<HStack justify="space-between" align="center">
				<Text {...THEME_STYLES.heading}>Fit Configurations</Text>
				<Badge variant="surface" colorPalette="cyan" size="sm">
					{configurations.length}
				</Badge>
			</HStack>

			{/* List Body */}
			{configurations.length === 0 ? (
				<Box
					p={4}
					border="1px dashed"
					borderColor="border.subtle"
					borderRadius="md"
					textAlign="center"
					bg="whiteAlpha.50"
				>
					<Text fontSize="xs" color="fg.muted" fontWeight="medium">
						NO CONFIGURATIONS FOUND
					</Text>
					<Text fontSize="2xs" color="fg.subtle" mt={1}>
						Save a model set in "Fit" panel first
					</Text>
				</Box>
			) : (
				<Box {...THEME_STYLES.scrollArea}>
					<HStack gap={3} px={1}>
						{configurations.map((config) => (
							<Card.Root
								key={config.id}
								{...THEME_STYLES.cardRoot(config.selected)}
								onClick={() => toggleConfigurationSelection(config.id)}
							>
								<Card.Body p={3}>
									<Stack gap={2}>
										{/* Row 1: Name & Checkbox */}
										<HStack justify="space-between" align="start">
											<Text
												fontWeight="bold"
												fontSize="xs"
												truncate
												maxW="100px"
												title={config.name}
												fontFamily="mono"
												color={config.selected ? "cyan.600" : "fg"}
												_dark={{ color: config.selected ? "cyan.300" : "fg" }}
											>
												{config.name}
											</Text>
											<Checkbox.Root
												checked={config.selected}
												size="xs"
												pointerEvents="none"
												colorPalette="cyan"
											>
												<Checkbox.HiddenInput />
												<Checkbox.Control />
											</Checkbox.Root>
										</HStack>

										{/* Row 2: Info & Actions */}
										<HStack justify="space-between" align="center">
											<Text
												fontSize="2xs"
												color="fg.muted"
												letterSpacing="wide"
											>
												{config.models.length} MODELS
											</Text>

											<HStack gap={0}>
												<IconButton
													aria-label="Configure Prior"
													size="xs"
													variant="ghost"
													h="20px"
													minW="20px"
													color="fg.muted"
													_hover={{ color: "cyan.400", bg: "whiteAlpha.200" }}
													onClick={(e) => {
														e.stopPropagation();
														setEditingId(config.id);
													}}
												>
													<LuSettings2 size={12} />
												</IconButton>

												<IconButton
													aria-label="Delete config"
													size="xs"
													variant="ghost"
													h="20px"
													minW="20px"
													color="fg.muted"
													_hover={{ color: "red.400", bg: "whiteAlpha.200" }}
													onClick={(e) => {
														e.stopPropagation();
														if (editingId === config.id) setEditingId(null);
														removeConfiguration(config.id);
													}}
												>
													<Trash2 size={12} />
												</IconButton>
											</HStack>
										</HStack>
									</Stack>
								</Card.Body>
							</Card.Root>
						))}
					</HStack>
				</Box>
			)}

			<GrismForwardPriorDrawer
				configId={editingId}
				isOpen={!!editingId}
				onClose={() => setEditingId(null)}
			/>
		</Stack>
	);
}
