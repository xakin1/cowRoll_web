import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";
import ReteEditor from "./editor/reteEditor/ReteEditor";

export function ConsoleApp() {
  return (
    <>
      <Provider store={store}>
        {/* <Terminal></Terminal> */}

        <ReteEditor></ReteEditor>
        <ToastContainer />
      </Provider>
    </>
  );
}

export default ConsoleApp;
