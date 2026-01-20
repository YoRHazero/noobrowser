import "@/components/three/CounterpartMaterial";
import { DoubleSide } from "three";
import { useGrismBackwardCounterpartLayer } from "./hooks/useGrismBackwardCounterpartLayer";

export default function GrismBackwardCounterpartImageLayer({
	visible,
}: {
	visible?: boolean;
}) {
	const {
		isVisible,
		texture,
		modeInt,
		opacity,
		counterpartPosition,
		handleContextMenu,
	} = useGrismBackwardCounterpartLayer(visible);

	/* -------------------------------------------------------------------------- */
	/*                  Return Null if not visible or no texture                  */
	/* -------------------------------------------------------------------------- */

	if (
		!isVisible ||
		!texture ||
		!counterpartPosition.height ||
		!counterpartPosition.width
	)
		return null;

	const { x0, y0, width, height } = counterpartPosition;
	const meshX = x0 + width / 2;
	const meshY = -y0 - height / 2;
	const meshZ = 0.05;

	return (
		<mesh position={[meshX, meshY, meshZ]} onContextMenu={handleContextMenu}>
			<planeGeometry args={[width, height]} />
			<counterpartMaterial
				uTexture={texture}
				uMode={modeInt}
				uOpacity={opacity}
				transparent={true}
				side={DoubleSide}
				depthWrite={false}
			/>
		</mesh>
	);
}
