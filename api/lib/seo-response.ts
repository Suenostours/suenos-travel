export type DynamicContentState = "not-required" | "found" | "missing" | "unavailable";

export function getSeoResponseStatus(input: {
  isKnownStaticPath: boolean;
  isClientStaticDetail: boolean;
  dynamicContentState: DynamicContentState;
}): 200 | 404 | 503 {
  if (input.dynamicContentState === "unavailable") return 503;
  if (input.dynamicContentState === "missing") return 404;
  if (input.isClientStaticDetail && !input.isKnownStaticPath) return 404;
  return 200;
}
