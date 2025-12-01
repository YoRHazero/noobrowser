import { useEffect } from "react";
import Footprint from "@/features/Footprint";
import { useGlobeStore } from "@/stores/footprints";

const MyComponent = () => {
	const setFootprints = useGlobeStore((state) => state.setFootprints);
	// Just some demo footprints
	useEffect(() => {
		setFootprints([
			{
				id: "fp1",
				vertices: [
					{ ra: 10, dec: 10 },
					{ ra: 20, dec: 10 },
					{ ra: 20, dec: 20 },
					{ ra: 10, dec: 20 },
				],
				meta: { source: "demo" },
			},
			{
				id: "fp2",
				vertices: [
					{ ra: 40, dec: -20 },
					{ ra: 50, dec: -20 },
					{ ra: 50, dec: -30 },
					{ ra: 40, dec: -30 },
				],
				meta: { source: "demo" },
			},
		]);
	}, []);

	return <Footprint />;
};
export default MyComponent;
