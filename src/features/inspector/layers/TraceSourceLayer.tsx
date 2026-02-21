import { TraceLinesLayer } from "./components/TraceSingleLine";
import { TraceMarkersLayer } from "./components/TraceMarker";

export default function TraceSourceLayer() {
	return (
		<group>
			<TraceLinesLayer />
			<TraceMarkersLayer />
		</group>
	);
}

export { TraceLinesLayer, TraceMarkersLayer };
