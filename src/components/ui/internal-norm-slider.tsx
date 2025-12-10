import { 
  Box, 
  Field, 
  NumberInput, 
  Slider, 
  HStack, 
} from "@chakra-ui/react";

// 🎨 主题配置
const UI_THEME = {
  maxColor: "pink.400",
  minColor: "cyan.400",
  // 向右的渐变
  gradient: "linear-gradient(to right, var(--chakra-colors-cyan-400), var(--chakra-colors-pink-400))",
};

interface HorizontalNormRangeSliderProps {
  pmin: number;
  pmax: number;
  vmin?: number;
  vmax?: number;
  onPminChange: (val: number) => void;
  onPmaxChange: (val: number) => void;
  onVminChange: (val: number) => void;
  onVmaxChange: (val: number) => void;
}

export function HorizontalNormRangeSlider({
  pmin,
  pmax,
  vmin,
  vmax,
  onPminChange,
  onPmaxChange,
  onVminChange,
  onVmaxChange,
}: HorizontalNormRangeSliderProps) {
  
  const handleSliderDrag = (details: { value: number[] }) => {
    const [newMin, newMax] = details.value;
    onPminChange(newMin);
    onPmaxChange(newMax);
  };

  return (
    <HStack
      w="100%"
      h="100%"
      px={2}
      gap={3}
      align="center"
    >
      {/* === MIN 控制区 (Left) === */}
      <HStack gap={2}>
        <CompactInput
          label="Min %"
          value={pmin}
          onChange={onPminChange}
          color={UI_THEME.minColor}
          step={0.1}
          width="55px"
        />
        <CompactInput
          label="Vmin"
          value={vmin}
          onChange={onVminChange}
          color={UI_THEME.minColor}
          width="65px"
        />
      </HStack>

      {/* === 滑块区域 (Middle) === */}
      <Box flex="1" position="relative" px={2} pt={2}> 
        {/* pt={2} 是为了让 thumb 的光晕不被切掉 */}
        <Slider.Root
          value={[pmin, pmax]}
          onValueChange={handleSliderDrag}
          min={0}
          max={100}
          step={0.1}
        >
            <Slider.Control>
                <Slider.Track bg="blackAlpha.200" height="4px" borderRadius="full">
                    <Slider.Range bgGradient={UI_THEME.gradient} />
                </Slider.Track>
                <StyledThumb index={0} color={UI_THEME.minColor} />
                <StyledThumb index={1} color={UI_THEME.maxColor} />
            </Slider.Control>
        </Slider.Root>
      </Box>

      {/* === MAX 控制区 (Right) === */}
      <HStack gap={2}>
        <CompactInput
          label="Vmax"
          value={vmax}
          onChange={onVmaxChange}
          color={UI_THEME.maxColor}
          width="65px"
        />
        <CompactInput
          label="Max %"
          value={pmax}
          onChange={onPmaxChange}
          color={UI_THEME.maxColor}
          step={0.1}
          width="55px"
        />
      </HStack>
    </HStack>
  );
}

// ✨ 紧凑型输入框
function CompactInput({
  value,
  onChange,
  color,
  label,
  step = 0.01,
  width = "60px"
}: {
  value: number | undefined;
  onChange: (val: number) => void;
  color: string;
  label: string;
  step?: number;
  width?: string;
}) {
  return (
    <Field.Root w="auto">
        <NumberInput.Root
            size="xs"
            step={step}
            value={value !== undefined ? String(value) : ""}
            onValueChange={(d) => onChange(d.valueAsNumber)}
            allowMouseWheel
            width={width}
        >
            <NumberInput.Input 
                px={1}
                fontSize="xs" 
                fontFamily="monospace" 
                fontWeight="semibold"
                textAlign="center"
                color={color}
                placeholder={label}
                bg="whiteAlpha.200" // 轻微背景色以便识别输入区域
                border="none"
                _focus={{ 
                    bg: "whiteAlpha.300", 
                    outline: "1px solid", 
                    outlineColor: color 
                }}
            />
        </NumberInput.Root>
    </Field.Root>
  );
}

// ✨ 滑块样式
function StyledThumb({ index, color }: { index: number; color: string }) {
  return (
    <Slider.Thumb 
      index={index} 
      boxSize="16px"
      bg="white"
      border="2px solid"
      borderColor={color}
      boxShadow={`0 0 6px ${color}`}
      outline="none"
    />
  );
}