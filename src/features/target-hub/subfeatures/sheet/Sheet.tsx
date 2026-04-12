"use client";

import { Shell } from "./parts/Shell";
import Editor from "./subfeatures/editor";
import Header from "./subfeatures/header";
import Ned from "./subfeatures/ned";
import Sources from "./subfeatures/sources";

export default function Sheet() {
	return (
		<Shell>
			<Header />
			<Editor detailActionAddon={<Ned />} />
			<Sources />
		</Shell>
	);
}
