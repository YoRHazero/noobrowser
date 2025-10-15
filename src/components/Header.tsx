import { Box, HStack, Link as CLink } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { ColorModeButton } from './ui/color-mode'

export default function Header() {
  return (
    <Box
      as="header"
      bg="bg"
      color="fg"
      px="3"
      py="2"
      borderBottomWidth="1px"
    >
      <HStack as="nav" justify="space-between">
        <HStack gap="4">
          <CLink asChild fontWeight="semibold">
            <RouterLink to="/">Home</RouterLink>
          </CLink>

          <CLink asChild fontWeight="semibold">
            <RouterLink to="/test">Test</RouterLink>
          </CLink>
        </HStack>
        <ColorModeButton />
      </HStack>
    </Box>
  )
}