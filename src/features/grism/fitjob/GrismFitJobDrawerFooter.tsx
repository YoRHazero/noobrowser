
import {
    Button,
    Flex,
    Drawer,
} from "@chakra-ui/react";

export default function GrismFitJobDrawerFooter() {
    return (
        <Drawer.Footer borderTop="1px solid #333">
             <Flex w="full" gap={2}>
                 {/* Placeholder for TagsInput */}
                 <Button variant="surface" flex={1} disabled>
                     Tags (Coming Soon)
                 </Button>
                 <Button colorPalette="blue" onClick={() => {}}>
                     Save
                 </Button>
             </Flex>
        </Drawer.Footer>
    );
}
