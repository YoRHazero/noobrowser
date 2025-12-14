import { useState } from "react";
import { Box, Collapsible, IconButton, HStack } from "@chakra-ui/react";
import { FiSettings, FiX } from "react-icons/fi";

interface CollapsiblePanelProps {
    children: React.ReactNode;
    miniStatus?: React.ReactNode;
}

export function CollapsiblePanel({ children, miniStatus }: CollapsiblePanelProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Box
            position="absolute"
            top={4}
            left={4}
            zIndex={10}
            maxW="60vw"
        >
            <Collapsible.Root
                open={isOpen}
                onOpenChange={(e) => setIsOpen(e.open)}
            >
                <HStack mb={2} align="center">
                    <Collapsible.Trigger asChild>
                        <IconButton
                            aria-label="Toggle Toolbar"
                            size="sm"
                            variant="surface"
                            bg="blackAlpha.600"
                            color="white"
                            _hover={{ bg: "blackAlpha.800" }}
                            rounded="full"
                        >
                            {isOpen ? <FiX /> : <FiSettings />}
                        </IconButton>
                    </Collapsible.Trigger>
                    
                    {/* Mini Status Display when Collapsed */}
                    {!isOpen && miniStatus && (
                         <Box 
                            px={3} py={1} 
                            bg="blackAlpha.600" 
                            backdropFilter="blur(4px)" 
                            rounded="full"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        >
                             {miniStatus}
                         </Box>
                    )}
                </HStack>

                {/* === Expanded Content === */}
                <Collapsible.Content>
                    <Box 
                        bg="blackAlpha.800" 
                        backdropFilter="blur(12px)" 
                        p={4} 
                        rounded="xl" 
                        border="1px solid" 
                        borderColor="whiteAlpha.100"
                        boxShadow="xl"
                        minW="600px" // Ensure a minimum width for sliders
                    >
                        {children}
                    </Box>                
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}