"use client";

import { NedView } from "./NedView";
import { useNed } from "./useNed";

export default function Ned() {
	const model = useNed();

	return <NedView model={model} />;
}
