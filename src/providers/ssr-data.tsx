import { createContext, useContext, type ReactNode } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../api/router";
import type { Locale } from "@/providers/i18n";

type RouterOutputs = inferRouterOutputs<AppRouter>;
export type PublicTourData = RouterOutputs["public"]["getTour"];
export type PublicTourListData = RouterOutputs["public"]["listTours"];

export type SsrRouteData =
  | { kind: "none" }
  | {
      kind: "tour";
      slug: string;
      locale: Locale;
      state: "found" | "missing" | "unavailable";
      data?: PublicTourData;
    }
  | {
      kind: "tour-catalog";
      locale: Locale;
      state: "found" | "empty" | "unavailable";
      data?: PublicTourListData;
    }
  | {
      kind: "quote-tour";
      slug: string;
      locale: Locale;
      state: "found" | "missing" | "unavailable";
      data?: PublicTourData;
    };

export type SsrData = {
  pathname: string;
  locale: Locale;
  routeData: SsrRouteData;
};

const EMPTY_SSR_DATA: SsrData = {
  pathname: "/",
  locale: "en",
  routeData: { kind: "none" },
};

const SsrDataContext = createContext<SsrData>(EMPTY_SSR_DATA);

export function SsrDataProvider({ data, children }: { data: SsrData; children: ReactNode }) {
  return <SsrDataContext.Provider value={data}>{children}</SsrDataContext.Provider>;
}

export function useSsrData() {
  return useContext(SsrDataContext);
}
