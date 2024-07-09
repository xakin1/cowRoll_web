import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Sidebar from "../../../src/components/rol/editor/sideBar/SideBar";

describe("Sidebar component", () => {
  it("renders correctly with initial open state", () => {
    render(<Sidebar />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("sidebar open");
  });

  it("toggles class to closed when clicked", async () => {
    render(<Sidebar />);
    const nav = screen.getByRole("navigation");
    fireEvent.click(nav);
    expect(nav.className).toContain("sidebar closed");
  });

  it("toggles back to open when clicked again", async () => {
    render(<Sidebar />);
    const nav = screen.getByRole("navigation");
    fireEvent.click(nav);
    fireEvent.click(nav);
    expect(nav.className).toContain("sidebar open");
  });

  it("svg-container class changes with sidebar", () => {
    render(<Sidebar />);
    const nav = screen.getByTestId("sidebar-nav");
    const svgContainer = screen.getByTestId("svg-container");

    expect(svgContainer.className).toContain("open");
    fireEvent.click(nav);
    expect(svgContainer.className).toContain("closed");
    fireEvent.click(nav);
    expect(svgContainer.className).toContain("open");
  });
});
