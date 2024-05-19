import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";
import Terminal from "./editor/terminal/Terminal";

export function ConsoleApp() {
  return (
    <>
      <Provider store={store}>
        <Terminal></Terminal>

        <ToastContainer />
      </Provider>
    </>
  );
}

export default ConsoleApp;
