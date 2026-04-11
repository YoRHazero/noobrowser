"use client";

import { HeaderView } from "./HeaderView";
import { useHeader } from "./useHeader";

export default function Header() {
	const { onOpenJobs, onReturnToDock } = useHeader();

	return <HeaderView onOpenJobs={onOpenJobs} onReturnToDock={onReturnToDock} />;
}
