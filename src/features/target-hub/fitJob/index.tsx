"use client";

import { FitJobView } from "./FitJobView";
import { useFitJob } from "./useFitJob";

export default function FitJob() {
	const { open, onClose } = useFitJob();

	return <FitJobView open={open} onClose={onClose} />;
}
