import {
	Badge,
	Box,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Ban, CheckCircle2, Globe, Trash2, Zap } from "lucide-react";

import { Tooltip } from "@/components/ui/tooltip";
import type { TraceSource } from "@/stores/stores-types";
import { sourceCardStyle } from "../../styles";
import type { GlobalSettings } from "../../types";

export default function SourceCardView(props: {
	source: TraceSource;
	isMain: boolean;
	settings: GlobalSettings;

	useDMS: boolean;
	worldText: string;
	worldTooltip: string;
	spectrumTooltip: string;

	isSpectrumActive: boolean;
	isSpectrumLoading: boolean;
	spectrumDisabled: boolean;

	onClickCard: () => void;
	onDelete: (e: React.MouseEvent) => void;
	onToggleWorldFormat: (e: React.MouseEvent) => void;
	onSpectrumToggle: (e: React.MouseEvent) => void;
}) {
	const {
		source,
		isMain,
		worldText,
		worldTooltip,
		spectrumTooltip,
		isSpectrumActive,
		isSpectrumLoading,
		spectrumDisabled,
		onClickCard,
		onDelete,
		onToggleWorldFormat,
		onSpectrumToggle,
	} = props;

	return (
		<Box
			onClick={onClickCard}
			cursor="pointer"
			bg={isMain ? sourceCardStyle.mainBg : sourceCardStyle.baseBg}
			borderColor={
				isMain ? sourceCardStyle.mainBorder : sourceCardStyle.baseBorder
			}
			borderWidth="1px"
			borderRadius="md"
			p={3}
			position="relative"
			transition="all 0.2s"
			_hover={{
				bg: isMain ? sourceCardStyle.hoverMainBg : sourceCardStyle.hoverBaseBg,
				borderColor: isMain
					? sourceCardStyle.hoverMainBorder
					: sourceCardStyle.hoverBaseBorder,
			}}
		>
			<Flex justify="space-between" align="start">
				<HStack gap={3} align="start">
					<Box
						mt={1.5}
						w="10px"
						h="10px"
						borderRadius="full"
						bg={source.color}
						boxShadow={`0 0 8px ${source.color}`}
					/>

					<Stack gap={1}>
						<HStack>
							<Text
								fontSize="xs"
								fontWeight="bold"
								color="white"
								fontFamily="mono"
							>
								{source.id.slice(0, 8).toUpperCase()}
							</Text>

							{isMain && (
								<Badge colorPalette="cyan" size="xs">
									MAIN
								</Badge>
							)}

							{source.spectrumReady ? (
								<Badge colorPalette="green" variant="solid" size="xs">
									<CheckCircle2 size={10} /> RDY
								</Badge>
							) : isSpectrumActive ? (
								<Badge colorPalette="yellow" variant="subtle" size="xs">
									LOADING
								</Badge>
							) : null}
						</HStack>

						<Stack gap={0}>
							<Text
								fontSize="xs"
								color="gray.500"
								fontFamily="mono"
								lineHeight={1.2}
							>
								XY: {source.x.toFixed(1)}, {source.y.toFixed(1)}
							</Text>

							<Tooltip content={worldTooltip}>
								<HStack
									cursor={source.ra ? "pointer" : "default"}
									onClick={onToggleWorldFormat}
									_hover={{ color: source.ra ? "cyan.300" : undefined }}
									h="18px"
								>
									<Globe size={10} color="#718096" />
									<Text
										fontSize="xs"
										color={source.ra ? "cyan.100" : "gray.600"}
										fontFamily="mono"
									>
										{worldText}
									</Text>
								</HStack>
							</Tooltip>
						</Stack>
					</Stack>
				</HStack>

				<Stack gap={2}>
					<Tooltip content="Delete Source">
						<IconButton
							aria-label="Delete source"
							size="xs"
							variant="ghost"
							colorPalette="red"
							onClick={onDelete}
						>
							<Trash2 size={14} />
						</IconButton>
					</Tooltip>

					<Tooltip content={spectrumTooltip}>
						<IconButton
							aria-label={
								isSpectrumActive || source.spectrumReady
									? "Clear Cache"
									: "Fetch Spectrum"
							}
							size="xs"
							variant={
								isSpectrumActive || source.spectrumReady ? "solid" : "outline"
							}
							colorPalette={
								isSpectrumActive || source.spectrumReady ? "red" : "cyan"
							}
							disabled={spectrumDisabled}
							loading={isSpectrumLoading}
							onClick={onSpectrumToggle}
						>
							{isSpectrumActive || source.spectrumReady ? (
								<Ban size={14} />
							) : (
								<Zap size={14} />
							)}
						</IconButton>
					</Tooltip>
				</Stack>
			</Flex>
		</Box>
	);
}
