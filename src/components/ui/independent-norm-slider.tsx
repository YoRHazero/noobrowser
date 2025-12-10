import { 
  Box, 
  Field, 
  NumberInput, 
  VStack, 
  Slider, 
  Text,
  HStack,
  Flex
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { LuArrowUpToLine, LuArrowDownToLine } from "react-icons/lu";

const VERTICAL_UI_THEME = {
  maxColor: "pink.400",
  minColor: "cyan.400",
  glassBg: "rgba(20, 20, 25, 0.7)", 
  borderColor: "rgba(255, 255, 255, 0.1)",
  gradient: "linear-gradient(to top, var(--chakra-colors-cyan-400), var(--chakra-colors-pink-400))",
};

interface VerticalNormRangeSliderProps {
  pmin: number;
  pmax: number;
  vmin?: number;
  vmax?: number; 

  onPminChange: (val: number) => void;
  onPmaxChange: (val: number) => void;
  onVminChange: (val: number) => void;
  onVmaxChange: (val: number) => void;
}

export function VerticalNormRangeSlider({
  pmin,
  pmax,
  vmin,
  vmax,
  onPminChange,
  onPmaxChange,
  onVminChange,
  onVmaxChange,
}: VerticalNormRangeSliderProps) {
  
  const handleSliderDrag = (details: { value: number[] }) => {
    const [newMin, newMax] = details.value;
    onPminChange(newMin);
    onPmaxChange(newMax);
  };

  return (
    <Box
      w="100%"
      h="100%"
      bg={VERTICAL_UI_THEME.glassBg}
      backdropFilter="blur(20px)"
      borderRadius="2xl"
      border="1px solid"
      borderColor={VERTICAL_UI_THEME.borderColor}
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
      p={3}
      transition="border-color 0.3s, box-shadow 0.3s"
      _hover={{ borderColor: "whiteAlpha.300", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
      display="flex"
      flexDirection="column"
    >
      {/* === MAX (Top) === */}
      <ControlSection icon={<LuArrowUpToLine />} color={VERTICAL_UI_THEME.maxColor} label="MAX">
        <GhostInput
          label="VAL"
          value={vmax}
          onChange={onVmaxChange}
          color={VERTICAL_UI_THEME.maxColor}
        />
        <GhostInput
          label="%"
          value={pmax}
          onChange={onPmaxChange}
          color={VERTICAL_UI_THEME.maxColor}
          step={0.1}
        />
      </ControlSection>

      {/* === Slider Area (Middle) === */}
      <Box flex="1" py={4} display="flex" justifyContent="center" position="relative">
        <Slider.Root
          orientation="vertical"
          value={[pmin, pmax]}
          onValueChange={handleSliderDrag}
          min={0}
          max={100}
          step={0.1}
          height="100%"
        >
            {/* Decoration Line */}
            <Box position="absolute" left="50%" top="0" bottom="0" w="1px" bg="whiteAlpha.100" transform="translateX(-50%)" zIndex={0} />

            <Slider.Control width="6px">
                <Slider.Track bg="whiteAlpha.100" borderRadius="full">
                    <Slider.Range bgGradient={VERTICAL_UI_THEME.gradient} />
                </Slider.Track>

                {/* Min Thumb */}
                <StyledThumb index={0} color={VERTICAL_UI_THEME.minColor} />
                
                {/* Max Thumb */}
                <StyledThumb index={1} color={VERTICAL_UI_THEME.maxColor} />
            </Slider.Control>
        </Slider.Root>
      </Box>

      {/* === MIN (Bottom) === */}
      <ControlSection icon={<LuArrowDownToLine />} color={VERTICAL_UI_THEME.minColor} label="MIN">
        <GhostInput
          label="%"
          value={pmin}
          onChange={onPminChange}
          color={VERTICAL_UI_THEME.minColor}
          step={0.1}
        />
        <GhostInput
          label="VAL"
          value={vmin}
          onChange={onVminChange}
          color={VERTICAL_UI_THEME.minColor}
        />
      </ControlSection>
    </Box>
  );
}


function StyledThumb({ index, color }: { index: number; color: string }) {
  return (
    <Slider.Thumb 
      index={index} 
      boxSize="20px"
      bg="gray.900"
      border="2px solid"
      borderColor={color}
      boxShadow={`0 0 10px ${color}`}
    >
       <Box w="6px" h="6px" borderRadius="full" bg={color} />
    </Slider.Thumb>
  );
}

function ControlSection({ children, icon, color, label }: { children: ReactNode, icon: ReactNode, color: string, label: string }) {
    return (
        <VStack 
            gap={1} w="100%" p={2} bg="whiteAlpha.50" 
            borderRadius="md" borderLeft="2px solid" borderColor={color}
        >
            <HStack w="100%" justify="space-between" color={color} opacity={0.9} mb={1}>
                 <Text fontSize="0.6rem" fontWeight="900" letterSpacing="0.1em">{label}</Text>
                 <Box fontSize="sm">{icon}</Box>
            </HStack>
            {children}
        </VStack>
    )
}

function GhostInput({
  value,
  onChange,
  color,
  label,
  step = 0.01,
}: {
  value: number | undefined;
  onChange: (val: number) => void;
  color: string;
  label: string;
  step?: number;
}) {
  return (
    <Field.Root>
        <Flex align="center" justify="space-between" mb={-1}>
            <Text fontSize="0.55rem" fontWeight="bold" color="whiteAlpha.500" letterSpacing="wider">
                {label}
            </Text>
        </Flex>
        <NumberInput.Root
            size="sm"
            step={step}
            value={value !== undefined ? String(value) : ""}
            onValueChange={(d) => onChange(d.valueAsNumber)}
            allowMouseWheel
        >
            <NumberInput.Input 
                px={0} py={1}
                fontSize="xs" fontFamily="monospace" fontWeight="semibold"
                textAlign="right" color={color}
                bg="transparent" border="none" outline="none" boxShadow="none"
                _placeholder={{ color: "whiteAlpha.300" }}
                transition="color 0.2s"
                _focus={{ color: "white" }} 
            />
        </NumberInput.Root>
    </Field.Root>
  );
}