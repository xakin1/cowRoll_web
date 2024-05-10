import english from "./locales/en.json";
import spanish from "./locales/es.json";
import galician from "./locales/gl.json";

const LANG = {
  ENGLISH: "en",
  SPANISH: "es",
  GALICIAN: "gl",
};

export const getI18N = ({ currentLocale = LANG.GALICIAN }) => {
  let localeData;
  switch (currentLocale) {
    case LANG.ENGLISH:
      localeData = { ...galician, ...spanish, ...english };
      break;
    case LANG.SPANISH:
      // Spanish should overwrite English and Galician
      localeData = { ...galician, ...english, ...spanish };
      break;
    case LANG.GALICIAN:
    default:
      localeData = galician;
      break;
  }

  return {
    t: (key: string, ...params: string[]): string => {
      const keys = key.split(".");
      let template: any = localeData;

      for (let k of keys) {
        if (template[k] !== undefined) {
          template = template[k];
        } else {
          template = null;
          break;
        }
      }

      if (typeof template === "string") {
        params.forEach((param, index) => {
          template = template.replace(new RegExp(`\\{${index}\\}`, "g"), param);
        });
        return template;
      }

      return "Key not found";
    },
  };
};
