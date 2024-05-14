//Detectanis neduabte js que es lo que prefiere el usuario si tema claro o oscuro

export function detectColorScheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

export function cookiesEnabled() {
  return navigator.cookieEnabled;
}
