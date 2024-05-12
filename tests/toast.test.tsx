import { render } from "react-dom";
import { toast, type ToastContainer } from "react-toastify";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-toastify", () => ({
  ...vi.importActual("react-toastify"), // import and spread all actual exports
  toast: vi.fn(), // mock only the toast function
}));

describe("TestToast Component", () => {
  it("displays a toast on button click", () => {
    render(<ToastContainer />);

    // Assuming the button text is "Show Toast"
    toast.error("shouldRender");

    // Check if toast function was called
    expect(toast).toHaveBeenCalledWith("Hello, this is a test toast!");
  });
});
