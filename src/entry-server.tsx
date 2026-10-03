import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import ServerApp from "@/ServerApp";
import AppRuntime from "@/AppRuntime";
import type { SsrData } from "@/providers/ssr-data";

export function renderApp(location: string, ssrData: SsrData) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={location}>
        <AppRuntime ssrData={ssrData}>
          <ServerApp />
        </AppRuntime>
      </StaticRouter>
    </StrictMode>,
  );
}
