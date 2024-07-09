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
