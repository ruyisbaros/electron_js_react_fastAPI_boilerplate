import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const setDynamicCSP = () => {
  const isDevelopment = import.meta.env.MODE === "development";

  const csp = isDevelopment
    ? "default-src 'self'; connect-src 'self' http://localhost:8000; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; font-src 'self';"
    : "default-src 'self'; connect-src 'self' https://deployed_domain.com; style-src 'self'; script-src 'self'; img-src 'self' data:; font-src 'self';";

  const metaCSP = document.createElement("meta");
  metaCSP.httpEquiv = "Content-Security-Policy";
  metaCSP.content = csp;
  document.head.appendChild(metaCSP);
};

// Call the function to set the CSP
setDynamicCSP();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
