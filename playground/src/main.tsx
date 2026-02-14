import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../../dist/index";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={{}}>
			<App />
		</ThemeProvider>
	</StrictMode>
);

