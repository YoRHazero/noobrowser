import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./app.css";

// Import Chakra UI provider
import { Provider as ChakraProvider } from "@/components/ui/provider";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import reportWebVitals from "./reportWebVitals.ts";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const rawBase = import.meta.env.BASE_URL;
const basepath =
  rawBase === "/" ? "" : rawBase.replace(/\/$/, "");
const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	basepath,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ChakraProvider>
				<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
					<RouterProvider router={router} />
				</TanStackQueryProvider.Provider>
			</ChakraProvider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
