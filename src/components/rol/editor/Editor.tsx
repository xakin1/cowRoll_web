import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import store from "../../../redux/store";
import WorkSpace from "./terminal/WorkSpace";

export function Editor() {
  return (
    <>
      <Provider store={store}>
        <WorkSpace></WorkSpace>

        <ToastContainer />
      </Provider>
    </>
  );
}

export default Editor;
