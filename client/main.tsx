import { createRoot } from "react-dom/client";
import App from "./App";

// Get the root element
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Create root only once and reuse it
let root: ReturnType<typeof createRoot> | null = null;

function render() {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}

// Initial render
render();

// Enable hot module replacement in development
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    render();
  });
}
