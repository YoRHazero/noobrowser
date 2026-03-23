// @/features/grism/tracesource/ManualSourceForm.tsx
import {
	Button,
	Collapsible,
	HStack,
	NumberInput,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronsUpDown, LuPlus } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useSourcePosition } from "@/hooks/query/source/useSourcePosition";
import { useCounterpartStore } from "@/stores/image";
import { useInspectorStore } from "@/stores/inspector";
import { useGlobeStore } from "@/stores/footprints";
import { useSourcesStore } from "@/stores/sources";


export default function ManualSourceForm() {
	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const { open, onToggle } = useDisclosure({ defaultOpen: false });
	const [ra, setRa] = useState<string>("");
	const [dec, setDec] = useState<string>("");
	const [isValidating, setIsValidating] = useState(false);

	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
	const addTraceSource = useSourcesStore((state) => state.addTraceSource);
	const roiState = useInspectorStore((state) => state.roiState);
	const collapseWindow = useInspectorStore((state) => state.roiCollapseWindow);

	/* -------------------------------------------------------------------------- */
	/*                                   Queries                                  */
	/* -------------------------------------------------------------------------- */
	// We use this imperatively via refetch
	const sourcePosQuery = useSourcePosition({
		ra: parseFloat(ra),
		dec: parseFloat(dec),
		enabled: false, // Important: don't auto-fetch
	});

	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleAdd = async () => {
		const raVal = parseFloat(ra);
		const decVal = parseFloat(dec);

		if (Number.isNaN(raVal) || Number.isNaN(decVal)) {
			toaster.error({
				title: "Invalid Input",
				description: "Please enter valid RA and Dec values.",
			});
			return;
		}

            // Check if width/height are set in store
            const { width, height } = useCounterpartStore.getState().counterpartPosition;
            if (!width || !height) {
                 toaster.error({
                    title: "No Footprint",
                    description: "Counterpart footprint is not loaded.",
                });
                return;
            }

		setIsValidating(true);
		try {
			// 1. Fetch Source Position (X, Y) from Backend
			const result = await sourcePosQuery.refetch();

			if (result.isError || !result.data) {
				throw new Error("Failed to resolve source position.");
			}

			const { x, y, ref_basename } = result.data;

			// 2. Check if inside footprint (Rectangular check)
			const { x0, y0, width, height } = useCounterpartStore.getState().counterpartPosition;
			
            const inside =
                x >= x0 &&
                x <= x0 + width &&
                y >= y0 &&
                y <= y0 + height;

			if (!inside) {
				toaster.error({
					title: "Out of Bounds",
					description: "Source is outside the current footprint.",
				});
				return;
			}

				// 3. Add to Store
				// Generate a stable source ID from the resolved footprint and coordinates.
				const id = `${ref_basename}_${raVal.toFixed(6)}_${decVal.toFixed(6)}`;

			addTraceSource(id, x, y, raVal, decVal, selectedFootprintId, {
				roiState,
				collapseWindow,
			});

			toaster.success({
				title: "Source Added",
				description: `Added source at RA:${raVal}, Dec:${decVal}`,
			});

			// Optional: Clear inputs?
			// setRa("");
			// setDec("");
		} catch (error) {
			console.error(error);
			toaster.error({
				title: "Error",
				description: "Could not add source.",
			});
		} finally {
			setIsValidating(false);
		}
	};

	return (
		<Stack gap={2} p={4} borderBottomWidth="1px" borderColor="border.subtle">
			<Button
				variant="ghost"
				size="sm"
				justifyContent="space-between"
				onClick={onToggle}
				color="fg.muted"
			>
				<Text fontWeight="medium">Manual Add</Text>
				<LuChevronsUpDown />
			</Button>

			<Collapsible.Root open={open}>
				<Collapsible.Content>
					<Stack gap={3} pt={2}>
						<HStack>
							<NumberInput.Root
								size="sm"
								value={ra}
								onValueChange={(e) => setRa(e.value)}
							>
								<NumberInput.Input placeholder="RA" />
							</NumberInput.Root>
							<NumberInput.Root
								size="sm"
								value={dec}
								onValueChange={(e) => setDec(e.value)}
							>
								<NumberInput.Input placeholder="Dec" />
							</NumberInput.Root>
						</HStack>
						<Button
							size="sm"
							colorPalette="cyan"
							variant="outline"
							onClick={handleAdd}
							loading={isValidating || sourcePosQuery.isLoading}
							disabled={!ra || !dec}
						>
							<LuPlus /> Add Source
						</Button>
					</Stack>
				</Collapsible.Content>
			</Collapsible.Root>
		</Stack>
	);
}
