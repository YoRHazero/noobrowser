import {
	Box,
	Button,
	HStack,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGlobeAnimation } from "@/features/footprint/hooks/animation-hook";
import { MAX_SCALE } from "@/components/pixi/GlobeViewport";
import { useGlobeStore } from "@/stores/footprints";
import { centerRaDecToView } from "@/utils/projection";
import { nanoid } from "nanoid";

export default function UserPointsPanel() {
	const { animateToView } = useGlobeAnimation();
	const { userPoints, addUserPoint, removeUserPoint } = useGlobeStore(
		useShallow((state) => ({
			userPoints: state.userPoints,
			addUserPoint: state.addUserPoint,
			removeUserPoint: state.removeUserPoint,
		})),
	);

	const [ra, setRa] = useState("");
	const [dec, setDec] = useState("");
	const [label, setLabel] = useState("");

	const handleAdd = () => {
		const raNum = parseFloat(ra);
		const decNum = parseFloat(dec);

		if (!Number.isFinite(raNum) || !Number.isFinite(decNum)) {
            // Toast or error handling could go here
			return;
		}

		addUserPoint({
			id: nanoid(),
			ra: raNum,
			dec: decNum,
			label: label.trim() || undefined,
		});

		setRa("");
		setDec("");
		setLabel("");
	};

	return (
		<Stack gap={4} p={3}>
			<Stack gap={2}>
				<Text fontWeight="medium" fontSize="sm">
					Add Point
				</Text>
				<HStack>
					<Input
						placeholder="RA (deg)"
						value={ra}
						onChange={(e) => setRa(e.target.value)}
						size="sm"
                        type="number"
					/>
					<Input
						placeholder="Dec (deg)"
						value={dec}
						onChange={(e) => setDec(e.target.value)}
						size="sm"
                        type="number"
					/>
				</HStack>
				<Input
					placeholder="Label (optional)"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					size="sm"
				/>
				<Button size="sm" onClick={handleAdd} disabled={!ra || !dec}>
					Add Point
				</Button>
			</Stack>

			<Stack gap={2}>
				<Text fontWeight="medium" fontSize="sm">
					Points List
				</Text>
				{userPoints.length === 0 ? (
					<Text color="fg.muted" fontSize="sm">
						No points added.
					</Text>
				) : (
					userPoints.map((point) => (
						<Box
							key={point.id}
							p={2}
							borderWidth="1px"
							rounded="md"
							borderColor="border.subtle"
							bg="bg.subtle"
						>
							<HStack justify="space-between" mb={1}>
								<Text fontWeight="bold" fontSize="sm">
									{point.label || "Point"}
								</Text>
								<HStack gap={1}>
									<Button
										size="xs"
										variant="ghost"
										onClick={() => {
											const { yawDeg, pitchDeg } = centerRaDecToView(
												point.ra,
												point.dec,
											);
											animateToView(yawDeg, pitchDeg, MAX_SCALE);
										}}
									>
										Goto
									</Button>
									<Button
										size="xs"
										variant="ghost"
                                        colorPalette="red"
										onClick={() => removeUserPoint(point.id)}
									>
										Delete
									</Button>
								</HStack>
							</HStack>
							<Text fontSize="xs" color="fg.muted">
								{point.ra.toFixed(5)}, {point.dec.toFixed(5)}
							</Text>
						</Box>
					))
				)}
			</Stack>
		</Stack>
	);
}
