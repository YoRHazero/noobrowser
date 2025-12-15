import {
  Box,
  Button,
  Drawer,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  Badge,
  CloseButton
} from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { Target, Trash2, Crosshair, ListFilter } from "lucide-react";
import { keyframes } from "@emotion/react";

import { useSourcesStore } from "@/stores/sources";
import type { TraceSource } from "@/stores/stores-types";

// --- 1. 定义动画和样式 ---
// 呼吸灯动画：用于 traceMode 为 True 时的按钮
const pulseKeyframe = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(0, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
`;

/**
 * 单个 Source 卡片组件
 */
const SourceCard = ({
  source,
  isMain,
  onSetMain,
  onRemove,
}: {
  source: TraceSource;
  isMain: boolean;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <Box
      onClick={() => onSetMain(source.id)}
      cursor="pointer"
      bg={isMain ? "cyan.900/30" : "whiteAlpha.50"} // V3 颜色写法
      borderColor={isMain ? "cyan.500" : "whiteAlpha.200"}
      borderWidth="1px"
      borderRadius="md"
      p={3}
      position="relative"
      transition="all 0.2s"
      _hover={{
        bg: isMain ? "cyan.900/40" : "whiteAlpha.100",
        borderColor: isMain ? "cyan.400" : "whiteAlpha.400",
        transform: "translateY(-1px)",
      }}
    >
      <Flex justify="space-between" align="center">
        <HStack gap={3}>
          {/* 颜色指示点 */}
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={source.color}
            boxShadow={`0 0 8px ${source.color}`}
            border="1px solid rgba(255,255,255,0.5)"
          />
          
          <Stack gap={0}>
            <HStack>
              <Text fontSize="sm" fontWeight="bold" color="white">
                ID: {source.id.slice(0, 8).toUpperCase()}
              </Text>
              {isMain && (
                <Badge colorPalette="cyan" variant="solid" size="xs">
                  MAIN
                </Badge>
              )}
            </HStack>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              X: {source.x.toFixed(2)} | Y: {source.y.toFixed(2)}
            </Text>
          </Stack>
        </HStack>

        <IconButton
          aria-label="Delete source"
          size="xs"
          variant="ghost"
          colorPalette="red"
          onClick={(e) => {
            e.stopPropagation(); // 防止触发选中 Main
            onRemove(source.id);
          }}
        >
          <Trash2 size={14} />
        </IconButton>
      </Flex>
    </Box>
  );
};

/**
 * 主 Drawer 组件
 */
export default function TraceSourceDrawer() {
  // --- Zustand Store ---
  const {
    traceMode,
    traceSources,
    mainTraceSourceId,
    setMainTraceSource,
    removeTraceSource,
  } = useSourcesStore(
    useShallow((state) => ({
      traceMode: state.traceMode,
      traceSources: state.traceSources,
      mainTraceSourceId: state.mainTraceSourceId,
      setMainTraceSource: state.setMainTraceSource,
      removeTraceSource: state.removeTraceSource,
    }))
  );

  // --- 触发器样式逻辑 ---
  const triggerProps = traceMode
    ? {
        // Tech Mode (显眼)
        colorPalette: "cyan",
        variant: "solid",
        animation: `${pulseKeyframe} 2s infinite`,
        border: "1px solid",
        borderColor: "cyan.400",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.2)",
        _hover: {
            transform: "scale(1.05)",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
        }
      } as const
    : {
        // Subtle Mode (低调)
        variant: "ghost",
        color: "gray.500",
        _hover: { color: "gray.300", bg: "whiteAlpha.100" }
      } as const;

  return (
    <Drawer.Root placement="end" size="md">
      {/* 1. 触发器 Trigger */}
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        <Button
          position="absolute"
          bottom="12px"    // 根据你的 Panel 布局调整
          right="12px"  // 根据你的 Panel 布局调整
          zIndex={10}
          size="sm"
          fontSize="xs"
          letterSpacing="wider"
          transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          {...triggerProps}
        >
          <HStack gap={2}>
            {traceMode ? <Target size={16} /> : <ListFilter size={16} />}
            <Text>{traceMode ? "ACTIVE TRACE" : "Sources"}</Text>
            {traceSources.length > 0 && (
               <Badge 
                 variant={traceMode ? "surface" : "solid"} 
                 colorPalette={traceMode ? "cyan" : "gray"}
                 size="xs"
               >
                 {traceSources.length}
               </Badge>
            )}
          </HStack>
        </Button>
      </Drawer.Trigger>

      {/* 2. Drawer 内容 */}
      <Drawer.Positioner>
        <Drawer.Content bg="#09090b" borderLeft="1px solid #333">
          <Drawer.Header borderBottom="1px solid #222" pb={4}>
            <HStack justify="space-between">
                <HStack>
                    <Crosshair color={traceMode ? "#00FFFF" : "gray"} />
                    <Heading size="sm" color="white">Trace Sources</Heading>
                </HStack>
                <Drawer.CloseTrigger asChild>
                    <CloseButton size={"sm"}/>
                </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>

          <Drawer.Body pt={4} px={4} className="custom-scrollbar">
            {traceSources.length === 0 ? (
                <Flex direction="column" align="center" justify="center" h="200px" color="gray.500">
                    <Target size={40} strokeWidth={1} style={{ opacity: 0.5, marginBottom: 10 }} />
                    <Text fontSize="sm">No trace sources added.</Text>
                    <Text fontSize="xs" mt={2}>
                        {traceMode ? "Shift + Right Click on map to add." : "Enable Trace Mode to add sources."}
                    </Text>
                </Flex>
            ) : (
                <Stack gap={3}>
                    {traceSources.map((source) => (
                        <SourceCard
                            key={source.id}
                            source={source}
                            isMain={source.id === mainTraceSourceId}
                            onSetMain={setMainTraceSource}
                            onRemove={removeTraceSource}
                        />
                    ))}
                </Stack>
            )}
          </Drawer.Body>
          
          <Drawer.Footer borderTop="1px solid #222">
            <Text fontSize="xs" color="gray.600" w="100%" textAlign="center">
                Total Sources: {traceSources.length} | Main ID: {mainTraceSourceId ? mainTraceSourceId.slice(0,6) : 'None'}
            </Text>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}