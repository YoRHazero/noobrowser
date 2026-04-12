"use client";

import { HeaderView } from "./HeaderView";
import { useHeader } from "./useHeader";

export default function Header() {
	const viewModel = useHeader();

	return <HeaderView {...viewModel} />;
}

export { HeaderView } from "./HeaderView";
