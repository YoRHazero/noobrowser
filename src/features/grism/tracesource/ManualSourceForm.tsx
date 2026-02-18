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
import { useCounterpartFootprint } from "@/hooks/query/image/useCounterpartFootprint";
import { useSourcePosition } from "@/hooks/query/source/useSourcePosition";
import { useGrismStore } from "@/stores/image";
import { useSourcesStore } from "@/stores/sources";

function isPointInPolygon(
	point: [number, number],
	vs: Array<[number, number]>,
): boolean {
	// ray-casting algorithm based on
	// https://github.com/substack/point-in-polygon
	const x = point[0];
	const y = point[1];

	let inside = false;
	for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		const xi = vs[i][0];
		const yi = vs[i][1];
		const xj = vs[j][0];
		const yj = vs[j][1];

		const intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
}

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
	const addTraceSource = useSourcesStore((state) => state.addTraceSource);
	const roiState = useGrismStore((state) => state.roiState);
	const collapseWindow = useGrismStore((state) => state.collapseWindow);

	/* -------------------------------------------------------------------------- */
	/*                                   Queries                                  */
	/* -------------------------------------------------------------------------- */
	// We always want the current footprint to check against
	const footprintQuery = useCounterpartFootprint({ enabled: true });

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

		if (!footprintQuery.data?.footprint?.vertices) {
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

			// 2. Check if inside footprint
			const inside = isPointInPolygon(
				[x, y],
				footprintQuery.data.footprint.vertices,
			);

			if (!inside) {
				toaster.error({
					title: "Out of Bounds",
					description: "Source is outside the current footprint.",
				});
				return;
			}

			// 3. Add to Store
			// Generate ID matching useGrismBackwardCounterpartLayer pattern
			const id = `${ref_basename}_${raVal.toFixed(6)}_${decVal.toFixed(6)}`;

			addTraceSource(id, x, y, raVal, decVal, null, {
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
