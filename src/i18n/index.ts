import english from "./locales/en.json";
import spanish from "./locales/es.json";
import galician from "./locales/gl.json";

const LANG = {
  ENGLISH: "en",
  SPANISH: "es",
  GALICIAN: "gl",
};

export const getI18N = ({
  currentLocale = "gl",
}: {
  currentLocale: string | undefined;
}) => {
  switch (currentLocale) {
    case LANG.ENGLISH:
      return { ...galician, ...spanish, ...english };
    case LANG.SPANISH:
      return { ...galician, ...english, ...spanish };
    case LANG.GALICIAN:
      return galician;
    default:
      return galician; // Devuelve gallego por defecto si no coincide ningún caso
  }
};
