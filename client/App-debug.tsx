import "./global.css";
import { createRoot } from "react-dom/client";

const App = () => {
  console.log("App component rendering...");
  return <div>Hello World - App is working!</div>;
};

console.log("About to render app...");
createRoot(document.getElementById("root")!).render(<App />);
console.log("App rendered!");
