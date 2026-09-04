export function optimizedImageUrl(value: string, width: number) {
  try {
    const url = new URL(value, window.location.origin);
    if (url.hostname !== "res.cloudinary.com" || !url.pathname.includes("/image/upload/")) {
      return value;
    }

    url.pathname = url.pathname.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,c_limit,w_${Math.max(320, Math.round(width))}/`,
    );
    return url.toString();
  } catch {
    return value;
  }
}
