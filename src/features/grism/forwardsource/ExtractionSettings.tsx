import {
	createListCollection,
	HStack,
	NumberInput,
	Portal,
	Select,
	Stack,
	Text,
} from "@chakra-ui/react";

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
	label: {
		fontSize: "2xs" as const,
		fontWeight: "bold" as const,
		color: "fg.muted",
		textTransform: "uppercase" as const,
		letterSpacing: "0.05em",
		mb: 1, // 减小标签和输入框的间距
	},
	// 统一样式，用于 NumberInput 和 Select
	controlBase: {
		bg: { base: "white", _dark: "blackAlpha.200" },
		borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
		_hover: { borderColor: "cyan.400" },
		_focusWithin: {
			// 使用 _focusWithin 保证整个控件组高亮
			borderColor: "cyan.500",
			boxShadow: "0 0 0 1px var(--chakra-colors-cyan-500)",
		},
	},
	selectContent: {
		bg: "bg.panel",
		borderColor: "border.subtle",
		backdropFilter: "blur(10px)",
		_dark: {
			bg: "rgba(20, 20, 25, 0.95)",
			borderColor: "whiteAlpha.200",
		},
	},
	selectItem: {
		cursor: "pointer" as const,
		transition: "all 0.1s ease-out",
		borderRadius: "sm",
		fontSize: "xs",
		_hover: {
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			color: { base: "cyan.600", _dark: "cyan.400" },
		},
		_highlighted: {
			bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			color: { base: "cyan.600", _dark: "cyan.400" },
		},
	},
};

const extractModeCollection = createListCollection({
	items: [
		{ label: "GRISMR", value: "GRISMR" },
		{ label: "GRISMC", value: "GRISMC" },
	],
});

interface ExtractionSettingsProps {
	apertureSize: number;
	setApertureSize: (val: number) => void;
	extractMode: string[];
	setExtractMode: (val: string[]) => void;
}

export default function ExtractionSettings({
	apertureSize,
	setApertureSize,
	extractMode,
	setExtractMode,
}: ExtractionSettingsProps) {
	return (
		<Stack gap={2} flexShrink={0}>
			<Text {...THEME_STYLES.heading}>Extraction Settings</Text>

			{/* 控件容器：使用 align="end" 对齐底部 */}
			<HStack gap={4} align="end">
				{/* Aperture Size Input Group */}
				<Stack gap={0}>
					<Text {...THEME_STYLES.label}>Aperture (px)</Text>
					<NumberInput.Root
						size="xs"
						value={apertureSize.toString()}
						onValueChange={(e) => setApertureSize(Number(e.value))}
						w="100px" // 显式设置紧凑宽度
					>
						<NumberInput.Control {...THEME_STYLES.controlBase} />
						<NumberInput.Input fontFamily="mono" />
					</NumberInput.Root>
				</Stack>

				{/* Extraction Mode Select Group */}
				<Stack gap={0}>
					<Text {...THEME_STYLES.label}>Mode</Text>
					<Select.Root
						collection={extractModeCollection}
						size="xs"
						value={extractMode}
						onValueChange={(e) => setExtractMode(e.value)}
						width="100px"
					>
						<Select.HiddenSelect />
						<Select.Control {...THEME_STYLES.controlBase}>
							<Select.Trigger>
								<Select.ValueText />
							</Select.Trigger>
						</Select.Control>
						<Portal>
							<Select.Positioner>
								<Select.Content {...THEME_STYLES.selectContent}>
									{extractModeCollection.items.map((item) => (
										<Select.Item
											item={item}
											key={item.value}
											{...THEME_STYLES.selectItem}
										>
											<Select.ItemText>{item.label}</Select.ItemText>
											<Select.ItemIndicator />
										</Select.Item>
									))}
								</Select.Content>
							</Select.Positioner>
						</Portal>
					</Select.Root>
				</Stack>
			</HStack>
		</Stack>
	);
}
