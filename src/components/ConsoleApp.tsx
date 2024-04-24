import { Provider } from "react-redux";
import store from "../redux/store.js";
import Terminal from "./Terminal.js";

function ConsoleApp() {
  return (
    <>
      <Provider store={store}>
        <Terminal></Terminal>
      </Provider>
    </>
  );
}

export default ConsoleApp;
