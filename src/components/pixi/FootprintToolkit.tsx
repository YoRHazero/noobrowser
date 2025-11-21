import {
    Button,
    Box,
    HStack,
    Text,
    NumberInput,
} from '@chakra-ui/react';

import { useGlobeStore } from '@/stores/footprints';
import { useShallow } from 'zustand/react/shallow';
import { centerRaDecToView, viewToCenterRaDec } from '@/utils/projection';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function FootprintToolkit() {
    const { view, setView } = useGlobeStore(
        useShallow((state) => ({
            view: state.view,
            setView: state.setView,
        }))
    );

    const center = useMemo(() => viewToCenterRaDec(view.yawDeg, view.pitchDeg), [view.yawDeg, view.pitchDeg]);

    const [raInput, setRaInput] = useState<number>(center.ra);
    const [decInput, setDecInput] = useState<number>(center.dec);

    // whether the input fields have been modified since last sync
    const [raDirty, setRaDirty] = useState(false);
    const [decDirty, setDecDirty] = useState(false);
    useEffect(() => {
        if (!raDirty) {
            setRaInput(center.ra);
        }
        if (!decDirty) {
            setDecInput(center.dec);
        }
    }, [center.ra, center.dec, raDirty, decDirty]);

    const onGoTo = useCallback(() => {
        const { yawDeg, pitchDeg } = centerRaDecToView(raInput, decInput);
        setView({ yawDeg, pitchDeg, scale: 200 });
        setRaDirty(false);
        setDecDirty(false);
    }, [raInput, decInput, setView]);

    const onReset = useCallback(() => {
        setView({ yawDeg: 0, pitchDeg: 0, scale: 1 });
        setRaDirty(false);
        setDecDirty(false);
    }, [setView]);

    return (
        <Box display="inline-flex" flexDirection="column" gap="8px">
            <HStack
                gap={2}
                p="6px 10px"
                rounded="md"
                boxShadow="sm"
            >
                <HStack gap={1}>
                    <Text>RA</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW="120px"
                        value={String(raInput)}
                        onValueChange={({ valueAsNumber }) => {
                            setRaInput(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
                            setRaDirty(true);
                        }}
                    >
                        <NumberInput.Input placeholder={ Number.isFinite(center.ra) ? center.ra.toFixed(4) : "" }/>
                    </NumberInput.Root>
                </HStack>
                <HStack gap={1}>
                    <Text>Dec</Text>
                    <NumberInput.Root
                        size="sm"
                        maxW="120px"
                        value={String(decInput)}
                        onValueChange={({ valueAsNumber }) => {
                            setDecInput(Number.isNaN(valueAsNumber) ? 0 : valueAsNumber);
                            setDecDirty(true);
                        }}
                    >
                        <NumberInput.Input placeholder={ Number.isFinite(center.dec) ? center.dec.toFixed(4) : "" }/>
                    </NumberInput.Root>
                </HStack>
                <Button size="sm" onClick={onGoTo}>Go To</Button>
                <Button size="sm" onClick={onReset}>Reset View</Button>
            </HStack>
        </Box>
    )
}