"use client";

import type { TraceSource } from "@/stores/stores-types";
import { useTraceSourceCard } from "../../hooks/useTraceSourceCard";
import type { GlobalSettings, UpdateSource } from "../../types";
import SourceCardView from "./SourceCard.view";

export default function SourceCardContainer(props: {
	source: TraceSource;
	isMain: boolean;
	settings: GlobalSettings;
	isValidSettings: boolean;
	onSetMain: (id: string) => void;
	onRemove: (id: string) => void;
	onUpdateSource: UpdateSource;
}) {
	const vm = useTraceSourceCard(props);
	return <SourceCardView {...vm} />;
}
