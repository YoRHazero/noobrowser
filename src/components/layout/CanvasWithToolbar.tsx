import {
    Box,
    IconButton,
    Collapsible,
    useDisclosure,
} from "@chakra-ui/react";
import { LuSettings2, LuChevronUp } from "react-icons/lu";
import type { ReactNode } from "react";

interface CanvasWithToolbarProps {
    canvas: ReactNode;
    toolbar: ReactNode;
    width?: string | number;
}
export default function CanvasWithToolbar({
    canvas,
    toolbar,
    width = 900
}: CanvasWithToolbarProps) {
    const { open, onToggle } = useDisclosure({ defaultOpen: false });
    return (
        <Box position="relative" w={width} role="group">
            {/* canvas */}
            <Box
                position="relative"
                zIndex={1}
                border = "1px solid"
                borderColor="border.subtle"
                transition="all 0.2s"
            >
                {canvas}

                <IconButton
                    aria-label="Toggle Toolbar"
                    onClick={onToggle}
                    size='xs'
                    variant={"solid"}
                    colorPalette={"gray"}
                    position="absolute"
                    bottom={2}
                    right={2}
                    zIndex={2}
                    rounded={"md"}
                    opacity={open ? 1: 0.4}
                    _groupHover={{ opacity: 1 }}
                    boxShadow={"md"}
                >
                    {open ? <LuChevronUp /> : <LuSettings2 />}
                </IconButton>
            </Box>
            {/* toolbar */}
            <Box 
                position="absolute"
                top="100%"
                left={0}
                right={0}
                zIndex={3}
                pointerEvents={open ? "auto" : "none"}
            >
                <Collapsible.Root open={open} unmountOnExit>
                    <Collapsible.Content>
                        <Box
                            h="48px"
                            bg="whiteAlpha.900"
                            _dark={{ bg: "gray.800" }}
                            backdropFilter="blur(8px)"
                            border="1px solid"
                            borderTop="none"
                            borderColor="border.subtle"
                            borderBottomRadius="md"
                            boxShadow="xl"
                            display="flex"
                            alignItems="center"
                        >
                            {toolbar}
                        </Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Box>
        </Box>
    )

}