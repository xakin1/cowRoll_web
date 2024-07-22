export function detectColorScheme(): string {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

export function cookiesEnabled(): boolean {
  return navigator.cookieEnabled;
}

export const rgbToHex = (rgb: string) => {
  const result = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return result
    ? "#" +
        ("0" + parseInt(result[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(result[3], 10).toString(16)).slice(-2)
    : rgb;
};

export function bytesToMB(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(2)} MB`;
}
