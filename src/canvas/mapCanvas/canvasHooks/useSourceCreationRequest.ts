import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Raycaster, Sphere, Vector2, Vector3 } from "three";
import type { MapCanvasActions, MapCanvasCreateSourceEvent } from "../api";
import { cartesianToRaDec } from "../utils";

export interface UseSourceCreationRequestParams {
	requestCreateSource?: MapCanvasActions["requestCreateSource"];
	radius: number;
}

function readCanvasPointerState(
	event: Pick<PointerEvent, "clientX" | "clientY">,
	element: Pick<Element, "getBoundingClientRect">,
) {
	const rect = element.getBoundingClientRect();

	return {
		client: {
			x: event.clientX,
			y: event.clientY,
		},
		local: {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		},
	};
}

function normalizeRa(ra: number) {
	return ((ra % 360) + 360) % 360;
}

export function useSourceCreationRequest({
	requestCreateSource,
	radius,
}: UseSourceCreationRequestParams) {
	const { camera, gl, size } = useThree();
	const { height, width } = size;
	const raycasterRef = useRef(new Raycaster());
	const ndcRef = useRef(new Vector2());
	const sphereRef = useRef(new Sphere(new Vector3(0, 0, 0), radius));
	const intersectionPointRef = useRef(new Vector3());

	useEffect(() => {
		sphereRef.current.radius = radius;
	}, [radius]);

	useEffect(() => {
		if (!requestCreateSource) {
			return;
		}

		const handleContextMenu = (event: MouseEvent) => {
			const { client, local } = readCanvasPointerState(event, gl.domElement);

			event.preventDefault();

			if (width <= 0 || height <= 0) {
				return;
			}

			ndcRef.current.set(
				(local.x / width) * 2 - 1,
				-((local.y / height) * 2 - 1),
			);
			raycasterRef.current.setFromCamera(ndcRef.current, camera);

			const intersection = raycasterRef.current.ray.intersectSphere(
				sphereRef.current,
				intersectionPointRef.current,
			);

			if (!intersection) {
				return;
			}

			const coordinate = cartesianToRaDec(intersection);
			const createEvent: MapCanvasCreateSourceEvent = {
				coordinate: {
					ra: normalizeRa(coordinate.ra),
					dec: coordinate.dec,
				},
				anchor: client,
				trigger: "context-menu",
			};

			requestCreateSource(createEvent);
		};

		gl.domElement.addEventListener("contextmenu", handleContextMenu);

		return () => {
			gl.domElement.removeEventListener("contextmenu", handleContextMenu);
		};
	}, [camera, gl, height, requestCreateSource, width]);
}
