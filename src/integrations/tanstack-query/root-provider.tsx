import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity, // the time after the data is considered stale, use infinity to avoid refetching when no refresh
				gcTime: 5 * 60 * 1000, // garbage collection time, the time after the observer of the data is zero
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
			},
		},
	});
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
