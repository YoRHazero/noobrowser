import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { toaster } from "@/components/ui/toaster";
import { useCounterpartFootprint } from "@/hooks/query/image/useCounterpartFootprint";
import { useCounterpartImage } from "@/hooks/query/image/useCounterpartImage";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";

export default function CounterpartRetrieveButton() {
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const filterRGB = useCounterpartStore((state) => state.filterRGB);

	const {
		refetch: refetchCounterpartImage,
		isFetching: isFetchingCounterpartImage,
		isSuccess: isSuccessCounterpartImage,
		isError: isErrorCounterpartImage,
		error: errorCounterpartImage,
	} = useCounterpartImage({}); // automatically retrieved from store
	const {
		isFetching: isFetchingCounterpartFootprint,
		isError: isErrorCounterpartFootprint,
		error: errorCounterpartFootprint,
	} = useCounterpartFootprint({});

	useEffect(() => {
		if (isErrorCounterpartFootprint && errorCounterpartFootprint) {
			const message = errorCounterpartFootprint?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve footprint",
					description: message,
				});
			});
		}
		if (isErrorCounterpartImage && errorCounterpartImage) {
			const message = errorCounterpartImage?.message ?? "Unknown error";
			queueMicrotask(() => {
				toaster.error({
					title: "Failed to retrieve counterpart image",
					description: message,
				});
			});
		}
		if (isSuccessCounterpartImage) {
			queueMicrotask(() => {
				toaster.success({ title: "The image is successfully retrieved" });
			});
		}
	}, [
		isErrorCounterpartFootprint,
		errorCounterpartFootprint,
		isErrorCounterpartImage,
		errorCounterpartImage,
		isSuccessCounterpartImage,
	]);
	return (
		<Button
			size="xs"
			h="24px"
			px={3}
			variant="surface"
			colorPalette="pink"
			fontSize="xs"
			fontWeight="bold"
			loading={isFetchingCounterpartFootprint || isFetchingCounterpartImage}
			onClick={() => {
				if (!selectedFootprintId) {
					toaster.error({
						title: "No footprint selected",
						description: "Please select a footprint first.",
					});
					return;
				}
				if (!filterRGB.r || !filterRGB.g || !filterRGB.b) {
					toaster.error({
						title: "Incomplete RGB filter",
						description: "Please set all RGB filter values.",
					});
					return;
				}
				refetchCounterpartImage();
			}}
			_hover={{
				bg: "pink.500",
				color: "white",
				borderColor: "pink.400",
			}}
		>
			<FiDownload /> Retrieve
		</Button>
	);
}
