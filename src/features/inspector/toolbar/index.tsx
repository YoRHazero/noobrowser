import { CollapsiblePanel } from "@/components/layout/CollapsiblePanel";
import BackwardToolbarStatus from "./BackwardToolbarStatus";
import EmissionMaskControl from "./EmissionMaskControl";
import GrismBackwardCounterpartControl from "./GrismBackwardCounterpartControl";
import GrismBackwardNormControls from "./GrismBackwardNormControl";

export default function GrismBackwardToolbar() {
	return (
		<CollapsiblePanel miniStatus={<BackwardToolbarStatus />}>
			<GrismBackwardCounterpartControl />
			<GrismBackwardNormControls />
			<EmissionMaskControl />
		</CollapsiblePanel>
	);
}
