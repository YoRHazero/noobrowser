import {
	Heading,
	HStack,
	Stack,
	Text,
	Box,
} from "@chakra-ui/react";
import { LuList } from "react-icons/lu";
import { useEmissionLineManager } from "@/hook/wavelength-hook";
import { ANGSTROM_PER_MICRON } from "@/utils/wavelength";
import { InfoTip } from "@/components/ui/toggle-tip";
import { EmissionLineItem } from "@/features/grism/forwardcontrol/EmissionLineItem";
import { EmissionLineAdder } from "@/features/grism/forwardcontrol/EmissionLineAdder";

// --- Theme Constants ---
const THEME_STYLES = {
	heading: {
		size: "sm" as const,
		letterSpacing: "wide",
		fontWeight: "extrabold",
		textTransform: "uppercase" as const,
		
		// 1. 修复标题：Light Mode 黑字，Dark Mode 渐变
		color: { base: "gray.700", _dark: "transparent" },
		bgGradient: { base: "none", _dark: "to-r" },
		gradientFrom: { _dark: "cyan.400" },
		gradientTo: { _dark: "purple.500" },
		bgClip: { base: "border-box", _dark: "text" },
	},
	headerContainer: {
		justify: "space-between",
		p: 4,
		pb: 2,
		flex: "0 0 auto",
		borderBottomWidth: "1px",
		
		// 2. 修复背景不一致：
		// 移除 "whiteAlpha.50" 背景，改为 "transparent"
		// 这样就能透出父组件 GrismForwardPanel 的渐变背景，看起来就一样了
		bg: "transparent",
		// 移除 backdropFilter，因为它依赖于半透明背景层
		backdropFilter: "none",

		// 适配边框颜色：白天灰色，晚上微弱白光
		borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
	},
	scrollArea: {
		flex: "1",
		overflowY: "auto" as const,
		bg: "transparent",
		p: 2,
		// 自定义滚动条
		css: {
			"&::-webkit-scrollbar": { width: "4px" },
			"&::-webkit-scrollbar-track": { background: "transparent" },
			"&::-webkit-scrollbar-thumb": {
				// 顺便修复滚动条：白天用灰色，晚上用半透明白
				background: "var(--chakra-colors-gray-300)", 
			},
			".chakra-theme.dark &::-webkit-scrollbar-thumb": {
				background: "var(--chakra-colors-whiteAlpha-200)",
			},
			"&::-webkit-scrollbar-thumb:hover": {
				background: "var(--chakra-colors-gray-400)",
			},
			".chakra-theme.dark &::-webkit-scrollbar-thumb:hover": {
				background: "var(--chakra-colors-whiteAlpha-400)",
			}
		},
	},
};

export default function EmissionLinesManager() {
	const {
		sortedLines,
		selectedKeys,
		waveUnit,
		zRedshift,
		inputName,
		setInputName,
		inputWavelength,
		setInputWavelength,
		canAdd,
		handleAdd,
		handleRemove,
		toggleSelection,
	} = useEmissionLineManager();

	const formatLineInfo = (restUm: number) => {
		const isMicron = waveUnit === "µm";
		const unitLabel = isMicron ? "μm" : "Å";
		const digits = isMicron ? 4 : 1;

		const restValNum = isMicron ? restUm : restUm * ANGSTROM_PER_MICRON;
		const zFactor = 1 + (Number.isFinite(zRedshift) ? zRedshift : 0);
		const obsValNum = restUm * zFactor * (isMicron ? 1 : ANGSTROM_PER_MICRON);

		return {
			rest: restValNum.toFixed(digits),
			obs: obsValNum.toFixed(digits),
			unit: unitLabel,
		};
	};

	return (
		<Stack gap={0} h="full">
			{/* --- Fixed Header --- */}
			<HStack {...THEME_STYLES.headerContainer}>
				<HStack gap={2} align="center">
					<Heading {...THEME_STYLES.heading}>Emission Lines</Heading>
					<InfoTip content="Add and select emission lines to display on the spectrum." />
				</HStack>

				<EmissionLineAdder
					waveUnit={waveUnit}
					inputName={inputName}
					setInputName={setInputName}
					inputWavelength={inputWavelength}
					setInputWavelength={setInputWavelength}
					canAdd={canAdd}
					onAdd={handleAdd}
				/>
			</HStack>

			{/* --- Scrollable List Section --- */}
			<Box {...THEME_STYLES.scrollArea}>
				{sortedLines.length === 0 ? (
					<Stack
						align="center"
						justify="center"
						h="full"
						color="fg.muted"
						gap={2}
						opacity={0.6}
					>
						<LuList size={24} style={{ opacity: 0.3 }} />
						<Text textStyle="xs" letterSpacing="wide">
							NO DATA FOUND
						</Text>
					</Stack>
				) : (
					<Stack gap={2}>
						{sortedLines.map(([lineName, wl]) => {
							const { rest, obs, unit } = formatLineInfo(wl);
							return (
								<EmissionLineItem
									key={lineName}
									name={lineName}
									restVal={rest}
									obsVal={obs}
									unit={unit}
									isSelected={selectedKeys.includes(lineName)}
									onToggle={(checked) => toggleSelection(lineName, checked)}
									onRemove={() => handleRemove(lineName)}
								/>
							);
						})}
					</Stack>
				)}
			</Box>
		</Stack>
	);
}