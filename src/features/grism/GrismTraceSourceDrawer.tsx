import {
	Badge,
	Box,
	Button,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	IconButton,
	NumberInput,
	Stack,
	Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query"; // 引入 QueryClient
import {
	Ban,
	CheckCircle2,
	Crosshair,
	Globe,
	ListFilter,
	Target,
	Trash2,
	Zap,
	Stamp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import {
	useExtractSpectrum,
	useSourcePosition
} from "@/hook/connection-hook";
// Store Imports
import { useSourcesStore } from "@/stores/sources";
import { useGrismStore } from "@/stores/image";
import type { TraceSource } from "@/stores/stores-types";

// --- 动画 ---
const pulseKeyframe = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(0, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
`;

// --- 类型 ---
interface GlobalSettings {
	apertureSize: number;
	waveMin: number;
	waveMax: number;
}

/**
 * 底部全局控制组件
 */
const GlobalControls = ({
	settings,
	setSettings,
	onClearAll,
	onApplyRoi,
	totalSources,
	mainTraceSourceId,
}: {
	settings: GlobalSettings;
	setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
	onClearAll: () => void;
	onApplyRoi: () => void;
	totalSources: number;
	mainTraceSourceId: string | null;
}) => {
	const isValid = settings.waveMin < settings.waveMax;
	const hasSources = totalSources > 0;
	return (
		<Box borderTop="1px solid #333" bg="black" p={4}>
			<Stack gap={3}>
				<HStack gap={4}>
					{/* Aperture */}
					<Stack gap={1} flex={1}>
						<Text fontSize="xs" color="gray.400">
							Aperture (px)
						</Text>
						<NumberInput.Root
							size="sm"
							value={settings.apertureSize.toString()}
							onValueChange={(e) => {
								const val = parseInt(e.value);
								if (!isNaN(val) && val > 1) {
									setSettings((s) => ({ ...s, apertureSize: val }));
								}
							}}
							min={2}
						>
							<NumberInput.Input
								bg="whiteAlpha.100"
								color="white"
								borderColor="gray.700"
							/>
						</NumberInput.Root>
					</Stack>

					{/* Wavelengths */}
					<Stack gap={1} flex={2}>
						<Text fontSize="xs" color="gray.400">
							Range (µm)
						</Text>
						<HStack>
							<NumberInput.Root
								size="sm"
								value={settings.waveMin.toString()}
								onValueChange={(e) =>
									setSettings((s) => ({ ...s, waveMin: parseFloat(e.value) }))
								}
								step={0.1}
							>
								<NumberInput.Input
									bg="whiteAlpha.100"
									color="white"
									borderColor={isValid ? "gray.700" : "red.500"}
								/>
							</NumberInput.Root>
							<Text color="gray.500">-</Text>
							<NumberInput.Root
								size="sm"
								value={settings.waveMax.toString()}
								onValueChange={(e) =>
									setSettings((s) => ({ ...s, waveMax: parseFloat(e.value) }))
								}
								step={0.1}
							>
								<NumberInput.Input
									bg="whiteAlpha.100"
									color="white"
									borderColor={isValid ? "gray.700" : "red.500"}
								/>
							</NumberInput.Root>
						</HStack>
					</Stack>
				</HStack>
				{!isValid && (
					<Text fontSize="xs" color="red.400">
						Error: Min &gt;= Max
					</Text>
				)}
				<HStack justify={"space-between"}>
					<Text fontSize="xs" color="gray.600" w="100%" textAlign="center">
						Total Sources: {totalSources} | Main ID:{" "}
						{mainTraceSourceId ? mainTraceSourceId.slice(0, 6) : "None"}
					</Text>
					<HStack gap={2}>
						<Tooltip content="Sync all sources with current ROI settings">
							<Button
								size="sm"
								variant="surface"
								colorPalette="cyan"
								onClick={onApplyRoi}
								disabled={!hasSources}
							>
								<Stamp size={14} style={{ marginRight: 8 }} />
								Sync
							</Button>
						</Tooltip>
						<Tooltip content="Remove all sources">
							<Button
								size="sm"
								variant="surface"
								colorPalette="red"
								onClick={onClearAll}
								disabled={!hasSources}
							>
								<Trash2 size={14} style={{ marginRight: 8 }} />
								Clear
							</Button>
						</Tooltip>
					</HStack>
				</HStack>
			</Stack>
		</Box>
	);
};

/**
 * 单个 Source 卡片
 */
const SourceCard = ({
	source,
	isMain,
	settings,
	isValidSettings,
	onSetMain,
	onRemove,
	onUpdateSource,
}: {
	source: TraceSource;
	isMain: boolean;
	settings: GlobalSettings;
	isValidSettings: boolean;
	onSetMain: (id: string) => void;
	onRemove: (id: string) => void;
	onUpdateSource: (id: string, patch: Partial<TraceSource>) => void;
}) => {
	const queryClient = useQueryClient();

	// 1. 本地状态
	const [useDMS, setUseDMS] = useState(false);
	// 控制是否发起 Spectrum 请求。
	// 注意：我们不直接依赖 source.spectrumReady，因为用户可能想重新 fetch
	const [isSpectrumActive, setIsSpectrumActive] = useState(false);

	// 2. World Coordinates Query (只Fetch一次)
	// 只要 store 里没有 RA，就尝试获取
	const shouldFetchCoords = source.ra === undefined || source.ra === null;
	const sourcePositionQuery = useSourcePosition({
		x: source.x,
		y: source.y,
		enabled: shouldFetchCoords,
	});

	// 3. Extract Spectrum Query (手动控制)
	const spectrumQuery = useExtractSpectrum({
		selectedFootprintId: source.groupId,
		x: Math.round(source.x),
		y: Math.round(source.y),
		apertureSize: settings.apertureSize,
		waveMin: settings.waveMin,
		waveMax: settings.waveMax,
		enabled: isSpectrumActive && isValidSettings, // 只有点击了按钮且设置合法才请求
	});

	// --- Effect: 处理 World Coordinates 返回 ---
	useEffect(() => {
		if (sourcePositionQuery.data) {
			// 使用 queueMicrotask 确保状态更新安全
			queueMicrotask(() => {
				onUpdateSource(source.id, {
					ra: sourcePositionQuery.data.ra,
					dec: sourcePositionQuery.data.dec,
					raHms: sourcePositionQuery.data.ra_hms,
					decDms: sourcePositionQuery.data.dec_dms,
				});
			});
		}
	}, [sourcePositionQuery.data, source.id, onUpdateSource]);

	// --- Effect: 处理 Spectrum 返回 ---
	useEffect(() => {
		if (spectrumQuery.isSuccess && spectrumQuery.data) {
			const isCovered = spectrumQuery.data.covered;

			queueMicrotask(() => {
				// 4. 根据 covered 更新 spectrumReady
				if (source.spectrumReady !== isCovered) {
					onUpdateSource(source.id, { spectrumReady: isCovered });
				}

				// 报告状态
				if (isCovered) {
					toaster.create({
						title: "Spectrum Extracted",
						description: `Source ${source.id.slice(0, 4)} is covered.`,
						type: "success",
					});
				} else {
					toaster.create({
						title: "Not Covered",
						description: `Source ${source.id.slice(0, 4)} has no spectrum data.`,
						type: "warning", // 黄色警告
					});
				}
			});
		} else if (spectrumQuery.isError) {
			queueMicrotask(() => {
				// 失败时也置为 false
				onUpdateSource(source.id, { spectrumReady: false });
				setIsSpectrumActive(false); // 自动关闭 active 状态以便重试
				toaster.create({
					title: "Fetch Failed",
					description: (spectrumQuery.error as Error).message,
					type: "error",
				});
			});
		}
	}, [
		spectrumQuery.isSuccess,
		spectrumQuery.isError,
		spectrumQuery.data,
		source.id,
		source.spectrumReady,
		onUpdateSource,
	]);

	// --- Action: Toggle Fetch / Clear Cache ---
	const handleSpectrumToggle = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isSpectrumActive || source.spectrumReady) {
			// >>> 3. 清除数据逻辑 <<<

			// A. 停止请求
			setIsSpectrumActive(false);

			// B. 更新 Store
			onUpdateSource(source.id, { spectrumReady: false });

			// C. 从 Tanstack Query 缓存中删除
			// Key 必须与 useExtractSpectrum hook 中的 queryKey 完全一致
			// ["extract_spectrum", group_id, queryX, queryY, aperture]
			const queryKey = [
				"extract_spectrum",
				source.groupId,
				Math.round(source.x),
				Math.round(source.y),
				settings.apertureSize,
			];

			queryClient.removeQueries({ queryKey });

			queueMicrotask(() => {
				toaster.create({
					description: "Spectrum cache cleared.",
					type: "info",
				});
			});
		} else {
			// >>> 开启请求 <<<
			setIsSpectrumActive(true);
		}
	};

	return (
		<Box
			onClick={() => onSetMain(source.id)}
			cursor="pointer"
			bg={isMain ? "cyan.900/30" : "whiteAlpha.50"}
			borderColor={isMain ? "cyan.500" : "whiteAlpha.200"}
			borderWidth="1px"
			borderRadius="md"
			p={3}
			position="relative"
			transition="all 0.2s"
			_hover={{
				bg: isMain ? "cyan.900/40" : "whiteAlpha.100",
				borderColor: isMain ? "cyan.400" : "whiteAlpha.400",
			}}
		>
			<Flex justify="space-between" align="start">
				<HStack gap={3} align="start">
					{/* 颜色点 */}
					<Box
						mt={1.5}
						w="10px"
						h="10px"
						borderRadius="full"
						bg={source.color}
						boxShadow={`0 0 8px ${source.color}`}
					/>

					<Stack gap={1}>
						{/* Header Info */}
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

							{/* Spectrum Status Badge */}
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

						{/* Coordinates Info */}
						<Stack gap={0}>
							{/* Pixel */}
							<Text
								fontSize="xs"
								color="gray.500"
								fontFamily="mono"
								lineHeight={1.2}
							>
								XY: {source.x.toFixed(1)}, {source.y.toFixed(1)}
							</Text>

							{/* World (Click to toggle format) */}
							<Tooltip
								content={
									useDMS
										? "Click to Switch to Degrees"
										: "Click to Switch to DMS"
								}
							>
								<HStack
									cursor={source.ra ? "pointer" : "default"}
									onClick={(e) => {
										e.stopPropagation();
										setUseDMS(!useDMS);
									}}
									_hover={{ color: source.ra ? "cyan.300" : undefined }}
									h="18px" // fixed height to prevent layout shift
								>
									<Globe size={10} color="#718096" />
									<Text
										fontSize="xs"
										color={source.ra ? "cyan.100" : "gray.600"}
										fontFamily="mono"
									>
										{source.ra && source.dec
											? useDMS
												? `${source.raHms ?? "-"}, ${source.decDms ?? "-"}`
												: `${source.ra.toFixed(5)}, ${source.dec.toFixed(5)}`
											: "Loading Coords..."}
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
							onClick={(e) => {
								e.stopPropagation();
								onRemove(source.id);
							}}
						>
							<Trash2 size={14} />
						</IconButton>
					</Tooltip>
					{/* 3. 交互组件: Fetch / Clear */}
					<Tooltip
						content={
							isSpectrumActive || source.spectrumReady
								? "Clear Spectrum Cache"
								: isValidSettings
									? "Fetch Spectrum"
									: "Invalid Settings"
						}
					>
						<IconButton
							aria-label={
								isSpectrumActive || source.spectrumReady
									? "Clear Cache"
									: "Fetch Spectrum"
							}
							size="xs"
							// 样式逻辑：如果 Ready 显示红色(删除)，如果未 Ready 显示青色(获取)
							variant={
								isSpectrumActive || source.spectrumReady ? "solid" : "outline"
							}
							colorPalette={
								isSpectrumActive || source.spectrumReady ? "red" : "cyan"
							}
							// 禁用逻辑：如果未激活且设置无效，则禁用
							disabled={
								!isSpectrumActive && !source.spectrumReady && !isValidSettings
							}
							loading={isSpectrumActive && spectrumQuery.isLoading}
							onClick={handleSpectrumToggle}
						>
							{/* 如果已经 Ready 或者正在 Fetch，显示 X (Clear)，否则显示 Zap (Fetch) */}
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
};

/**
 * 主 Drawer 组件
 */
export default function GrismTraceSourceDrawer() {
	const {
		traceMode,
		traceSources,
		mainTraceSourceId,
		setMainTraceSource,
		removeTraceSource,
		clearTraceSources,
		updateTraceSource,
		applyRoiToAllTraceSources,
	} = useSourcesStore(
		useShallow((state) => ({
			traceMode: state.traceMode,
			traceSources: state.traceSources,
			mainTraceSourceId: state.mainTraceSourceId,
			setMainTraceSource: state.setMainTraceSource,
			removeTraceSource: state.removeTraceSource,
			clearTraceSources: state.clearTraceSources,
			updateTraceSource: state.updateTraceSource,
			applyRoiToAllTraceSources: state.applyRoiToAllTraceSources,
		})),
	);
	const { roiState, collapseWindow, apertureSize, setApertureSize, forwardWaveRange, setForwardWaveRange } = useGrismStore(
		useShallow((state) => ({
			roiState: state.roiState,
			collapseWindow: state.roiCollapseWindow,
			apertureSize: state.apertureSize,
			setApertureSize: state.setApertureSize,
			forwardWaveRange: state.forwardWaveRange,
			setForwardWaveRange: state.setForwardWaveRange,
		})),
	);
	const settings: GlobalSettings = {
		apertureSize: apertureSize,
		waveMin: forwardWaveRange.min,
		waveMax: forwardWaveRange.max,
	};
    const setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>> = (value) => {
        const nextSettings = typeof value === 'function'
            ? (value as (prevState: GlobalSettings) => GlobalSettings)(settings)
            : value;
        setApertureSize(nextSettings.apertureSize);
        setForwardWaveRange({ 
            min: nextSettings.waveMin, 
            max: nextSettings.waveMax 
        });
    };

	const triggerProps = traceMode
		? ({
				colorPalette: "cyan",
				variant: "solid",
				animation: `${pulseKeyframe} 2s infinite`,
				boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
			} as const)
		: ({ variant: "ghost", color: "gray.500" } as const);

	return (
		<Drawer.Root placement="end" size="md">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>
				<Button
					position="absolute"
					bottom="12px"
					right="12px"
					zIndex={10}
					size="sm"
					fontSize="xs"
					{...triggerProps}
				>
					<HStack gap={2}>
						{traceMode ? <Target size={16} /> : <ListFilter size={16} />}
						<Text>{traceMode ? "TRACE ACTIVE" : "Sources"}</Text>
						{traceSources.length > 0 && (
							<Badge
								variant="solid"
								colorPalette={traceMode ? "cyan" : "gray"}
								size="xs"
							>
								{traceSources.length}
							</Badge>
						)}
					</HStack>
				</Button>
			</Drawer.Trigger>

			<Drawer.Positioner>
				<Drawer.Content bg="#09090b" borderLeft="1px solid #333">
					<Drawer.Header borderBottom="1px solid #222" pb={4}>
						<HStack justify="space-between">
							<HStack>
								<Crosshair color={traceMode ? "#00FFFF" : "gray"} />
								<Heading size="sm" color="white">
									Trace Sources
								</Heading>
							</HStack>
							<Drawer.CloseTrigger asChild>
								<CloseButton size="md"/>
							</Drawer.CloseTrigger>
						</HStack>
					</Drawer.Header>

					<Drawer.Body pt={4} px={4} className="custom-scrollbar">
						{traceSources.length === 0 ? (
							<Flex
								direction="column"
								align="center"
								justify="center"
								h="200px"
								color="gray.500"
							>
								<Target size={40} style={{ opacity: 0.5, marginBottom: 10 }} />
								<Text fontSize="sm">No trace sources.</Text>
							</Flex>
						) : (
							<Stack gap={3}>
								{traceSources.map((source) => (
									<SourceCard
										key={source.id}
										source={source}
										isMain={source.id === mainTraceSourceId}
										settings={settings}
										isValidSettings={settings.waveMin < settings.waveMax}
										onSetMain={setMainTraceSource}
										onRemove={removeTraceSource}
										onUpdateSource={updateTraceSource}
									/>
								))}
							</Stack>
						)}
					</Drawer.Body>

					<GlobalControls
						settings={settings}
						setSettings={setSettings}
						onClearAll={clearTraceSources}
						onApplyRoi={() =>
							applyRoiToAllTraceSources({
								roiState,
								collapseWindow,
							})
						}
						totalSources={traceSources.length}
						mainTraceSourceId={mainTraceSourceId}
					/>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
