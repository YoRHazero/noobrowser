import {
    Box,
    Field,
    HStack,
    NumberInput,
    Slider,
    Text,
} from "@chakra-ui/react";

/* -------------------------------------------------------------------------- */
/*                                 Nrom Slider                                */
/* -------------------------------------------------------------------------- */
const NORM_THEME = {
    maxColor: "pink.400",
    minColor: "cyan.400",
    // 向右的渐变
    gradient:
        "linear-gradient(to right, var(--chakra-colors-cyan-400), var(--chakra-colors-pink-400))",
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
    onPminInputChange?: (val: number) => void;
    onPmaxInputChange?: (val: number) => void;
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
    onPmaxInputChange,
    onPminInputChange,
}: HorizontalNormRangeSliderProps) {
    const handleSliderDrag = (details: { value: number[] }) => {
        const [newMin, newMax] = details.value;
        onPminChange(newMin);
        onPmaxChange(newMax);
    };
    const handlePmaxInputChange = onPmaxInputChange ?? onPmaxChange;
    const handlePminInputChange = onPminInputChange ?? onPminChange;
    return (
        <HStack w="100%" h="100%" px={2} gap={3} align="center">
            {/* === MIN 控制区 (Left) === */}
            <HStack gap={2}>
                <CompactInput
                    label="Min %"
                    value={pmin}
                    onChange={handlePminInputChange}
                    color={NORM_THEME.minColor}
                    step={0.1}
                    width="55px"
                />
                <CompactInput
                    label="Vmin"
                    value={vmin}
                    onChange={onVminChange}
                    color={NORM_THEME.minColor}
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
                        <Slider.Track
                            bg="blackAlpha.200"
                            height="4px"
                            borderRadius="full"
                        >
                            <Slider.Range bgGradient={NORM_THEME.gradient} />
                        </Slider.Track>
                        <StyledThumb index={0} color={NORM_THEME.minColor} />
                        <StyledThumb index={1} color={NORM_THEME.maxColor} />
                    </Slider.Control>
                </Slider.Root>
            </Box>

            {/* === MAX 控制区 (Right) === */}
            <HStack gap={2}>
                <CompactInput
                    label="Vmax"
                    value={vmax}
                    onChange={onVmaxChange}
                    color={NORM_THEME.maxColor}
                    width="65px"
                />
                <CompactInput
                    label="Max %"
                    value={pmax}
                    onChange={handlePmaxInputChange}
                    color={NORM_THEME.maxColor}
                    step={0.1}
                    width="55px"
                />
            </HStack>
        </HStack>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Opacity Slider                               */
/* -------------------------------------------------------------------------- */
interface HorizontalOpacitySliderProps {
    opacity: number;
    onOpacityChange: (val: number) => void;
    onOpacityInputChange?: (val: number) => void;
    color?: string;
    label?: string;
}

export function HorizontalOpacitySlider({
    opacity,
    onOpacityChange,
    onOpacityInputChange,
    color = "pink.400",
    label = "Opacity",
}: HorizontalOpacitySliderProps) {
    const handleInputChange = onOpacityInputChange ?? onOpacityChange;
    return (
        <HStack w="100%" h="100%" px={2} gap={3} align="center">
            <Box flex="1" position="relative" px={2} pt={2}>
                <Slider.Root
                    value={[opacity]}
                    onValueChange={(e) => onOpacityChange(e.value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                >
                    <Slider.Control>
                        <Slider.Track
                            bg="whiteAlpha.200"
                            height="4px"
                            borderRadius="full"
                        >
                            <Slider.Range bg={color} />
                        </Slider.Track>
                        <StyledThumb index={0} color={color} />
                    </Slider.Control>
                </Slider.Root>
            </Box>

            <HStack gap={1}>
                <CompactInput
                    value={opacity}
                    onChange={handleInputChange}
                    color={color}
                    width="60px"
                    label={label}
                    step={0.01}
                />
            </HStack>
        </HStack>
    );
}

interface HorizontalSpec1DParamsSliderProps {
    refIndex: number;
    lambda0: number;
    fwhm: number;
    onFwhmChange: (val: number) => void;
    onRefIndexChange: (val: number) => void;
    onLambda0Change: (val: number) => void;
    angPerPixel?: number;
    refIndexRange?: [number, number];
    color?: string;
}

export function HorizontalSpec1DParamsSlider({
    refIndex,
    lambda0,
    fwhm,
    onRefIndexChange,
    onLambda0Change,
    onFwhmChange,
    angPerPixel,
    refIndexRange = [0, 255],
    color = "yellow.400",
}: HorizontalSpec1DParamsSliderProps) {
    return (
        <HStack w="100%" h="100%" px={2} gap={3} align="center">
            <Box flex="1" position="relative" px={2} pt={1}>
                <Slider.Root
                    value={[refIndex]}
                    onValueChange={(e) => onRefIndexChange(e.value[0])}
                    min={refIndexRange[0]}
                    max={refIndexRange[1]}
                    step={1}
                >
                    <Slider.Control>
                        <Slider.Track
                            bg="whiteAlpha.200"
                            height="4px"
                            borderRadius="full"
                        >
                            <Slider.Range bg={color} />
                        </Slider.Track>
                        <StyledThumb index={0} color={color} />
                    </Slider.Control>
                </Slider.Root>
            </Box>
            <HStack gap={1}>

                <Text fontSize="sm" color="gray.400">
                    {"λ₀ (Å):"}
                </Text>
                <CompactInput
                    value={lambda0}
                    onChange={onLambda0Change}
                    color={color}
                    label={`λ₀ (Å)`}
                    step={1}
                    width="60px"
                />
                <Text fontSize="sm" color="gray.400">
                    {"fwhm (km/s):"}
                </Text>
            
                <CompactInput
                    value={fwhm}
                    onChange={onFwhmChange}
                    color={color}
                    label="FWHM (km/s)"
                    step={50}
                    width="60px"
                />
                {angPerPixel && (
                    <Text fontSize="sm" color="gray.400" fontFamily="mono">
                        {/* λ₀ 对应像素: */}
                        {`pixel scale: ${angPerPixel.toFixed(2)}`}
                    </Text>
                )}
            </HStack>
        </HStack>
            
    )
}

// ✨ 紧凑型输入框
function CompactInput({
    value,
    onChange,
    color,
    label,
    step = 0.01,
    width = "60px",
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
                        outlineColor: color,
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
