"use client";

import FitJob from "../fitJob";
import Editor from "./editor";
import Header from "./header";
import { SheetShell } from "./layout/SheetShell";
import Sources from "./sources";

export default function Sheet() {
	return (
		<>
			<SheetShell>
				<Header />
				<Editor />
				<Sources />
			</SheetShell>
			<FitJob />
		</>
	);
}
