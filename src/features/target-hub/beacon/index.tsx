"use client";

import { BeaconView } from "./BeaconView";
import { useBeacon } from "./useBeacon";

export default function Beacon() {
	const viewModel = useBeacon();

	return <BeaconView {...viewModel} />;
}
