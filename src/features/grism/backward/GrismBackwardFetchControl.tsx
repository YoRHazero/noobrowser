import { Box, Button } from "@chakra-ui/react";
import { useEffect, useId, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { useGrismData } from "@/hooks/query/image/useGrismData";
import { useGrismErr } from "@/hooks/query/image/useGrismErr";
import { useGrismOffsets } from "@/hooks/query/image/useGrismOffsets";
import { useGlobeStore } from "@/stores/footprints";

export default function GrismBackwardFetchControl() {
	const id = useId();
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const [enable, setEnable] = useState(false);
	const dataQueries = useGrismData({ enabled: enable });
	const errQueries = useGrismErr({ enabled: enable });
	const offsetQueries = useGrismOffsets({ enabled: enable });
	useEffect(() => {
		if (!selectedFootprintId) {
			setEnable(false);
			return;
		}
		setEnable(false);
	}, [selectedFootprintId]);

	const allQueriesSuccess =
		enable &&
		[dataQueries, errQueries, offsetQueries].every((record) => {
			const queries = Object.values(record ?? {});
			if (queries.length === 0) return true;
			return queries.every((q) => q.isSuccess);
		});
	const isFetching =
		enable &&
		[dataQueries, errQueries, offsetQueries].some((record) => {
			const queries = Object.values(record ?? {});
			if (queries.length === 0) return false;
			return queries.some((q) => q.isFetching);
		});
	if (!selectedFootprintId || allQueriesSuccess) {
		return null;
	}
	return (
		<Box position="absolute" bottom={4} right={4} zIndex={10}>
			<Tooltip
				ids={{ trigger: id }}
				content="Load all grism images for the current group"
			>
				<Button
					id={id}
					size="xl"
					variant="solid"
					bg="whiteAlpha.400"
					borderRadius="full"
					p={4}
					boxShadow="lg"
					onClick={() => setEnable(true)}
					color="white"
					_hover={{ bg: "whiteAlpha.600" }}
					_active={{ bg: "whiteAlpha.800" }}
					_focus={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.7)" }}
					loading={isFetching}
				>
					Fetch
				</Button>
			</Tooltip>
		</Box>
	);
}
