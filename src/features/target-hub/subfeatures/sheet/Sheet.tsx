"use client";

import { Shell } from "./parts/Shell";
import Editor from "./subfeatures/editor";
import Header from "./subfeatures/header";
import Ned from "./subfeatures/ned";
import Sources from "./subfeatures/sources";
import { useSheet } from "./useSheet";

export default function Sheet() {
	useSheet();

	return (
		<Shell>
			<Header />
			<Editor detailActionAddon={<Ned />} />
			<Sources />
		</Shell>
	);
}
