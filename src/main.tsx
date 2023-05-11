import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { inject, track } from "@vercel/analytics";
import NotificationWrapper from "./components/notify";

inject();

track("pageview", {
    path: window.location.href,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <NotificationWrapper>
        <App />
      </NotificationWrapper>
    </React.StrictMode>
);
