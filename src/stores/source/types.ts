export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type Source = {
	id: string;
	x: number;
	y: number;
	color: string;
	spectrumReady: boolean;
	ra: number;
	dec: number;
	z?: number;
	raHms?: string;
	decDms?: string;
	groupId?: string | null;
	fitState?: {
		jobId?: string;
		jobStatus?: JobStatus;
	};
};
