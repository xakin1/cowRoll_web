import { Provider } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import store from "../redux/store";
import Terminal from "./editor/terminal/Terminal";

export function ConsoleApp() {
  const notify = () => {
    toast("Default Notification !");

    toast.success("Success Notification !", {
      position: "top-center",
    });

    toast.error("Error Notification !", {
      position: "top-left",
    });

    toast.warn("Warning Notification !", {
      position: "bottom-left",
    });

    toast.info("Info Notification !", {
      position: "bottom-center",
    });

    toast("Custom Style Notification with css class!", {
      position: "bottom-right",
      className: "foo-bar",
    });
  };

  return (
    <>
      <Provider store={store}>
        <Terminal></Terminal>
        <button onClick={notify}>Notify</button>;
        <ToastContainer />
      </Provider>
    </>
  );
}

export default ConsoleApp;
