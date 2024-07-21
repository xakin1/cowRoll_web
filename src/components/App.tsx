import { Provider } from "react-redux";
import { ToastContainer, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";
import "../styles/global.css";
import AppRoute from "./Route";
export const toastStyle: ToastOptions<unknown> = {
  position: "bottom-right",
};

const AppRol = () => {
  return (
    <Provider store={store}>
      <AppRoute></AppRoute>
      <ToastContainer />
    </Provider>
  );
};

export default AppRol;
