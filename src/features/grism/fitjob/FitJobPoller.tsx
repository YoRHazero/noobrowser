import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function FitJobPoller() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const intervalId = setInterval(() => {
			queryClient.invalidateQueries({ queryKey: ["fit", "jobs"] });
		}, 2000);

		return () => clearInterval(intervalId);
	}, [queryClient]);

	return null;
}
