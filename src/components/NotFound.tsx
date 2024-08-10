import i18n from "../i18n/i18n";

const NotFound = () => {
  return (
    <div>
      <h1>{i18n.t("Pages.404")}</h1>
      <p>{i18n.t("Pages.pageNotFound")}</p>
    </div>
  );
};

export default NotFound;
