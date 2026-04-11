"use client";

import { Beacon as BeaconComponent } from "./Beacon";
import { useBeacon } from "./useBeacon";

export default function Beacon() {
	const viewModel = useBeacon();

	return <BeaconComponent {...viewModel} />;
}
