import { getI18N } from ".";
import { getLang } from "./utils";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

export default i18n;
