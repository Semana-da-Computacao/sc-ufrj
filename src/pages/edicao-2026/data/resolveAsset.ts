export function resolveAssetPath(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path}`;
}
