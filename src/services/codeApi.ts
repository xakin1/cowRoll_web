import { addCompileErrors, addOutput } from "../redux/slice/codeSlide";
import store from "../redux/store";

const apiUrl = import.meta.env.PUBLIC_API_URL;
export async function saveCode(code: string) {
  const response = await fetch(apiUrl + "api/saveCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  if (response.ok) {
    const data = await response.json();
    store.dispatch(addCompileErrors(data));
  } else {
    console.error("Failed to save the document.");
  }
}

export async function executeCode(code: string) {
  try {
    const response = await fetch(apiUrl + "api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code }),
    });
    const data = await response.json();
    store.dispatch(addOutput(data));
  } catch (error) {
    console.error("Execution error:", error);
  }
}
