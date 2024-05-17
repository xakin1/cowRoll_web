import { defaultLang, ui } from "./ui";

export const showDefaultLang = false;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLang() {
  // Crear un objeto URL a partir de window.location.href
  const url = new URL(window.location.href);

  const [, lang] = url.pathname.split("/");
  if (lang in ui) {
    return lang as keyof typeof ui;
  }

  // Obtener el locale del dispositivo
  const deviceLocale = navigator.language;
  const deviceLang = deviceLocale.split("-")[0]; // Obtener solo el código de idioma (por ejemplo, "en" de "en-US")
  if (deviceLang in ui) {
    return deviceLang as keyof typeof ui;
  }

  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
  };
}
