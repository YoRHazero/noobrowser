import { Box, Text } from "@chakra-ui/react";

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Text fontSize="xs" color="fg.muted" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="medium" fontFamily="mono">
        {value}
      </Text>
    </Box>
  );
}
