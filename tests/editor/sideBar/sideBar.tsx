import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Sidebar from "../../../src/components/editor/sideBar/SideBar";

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
    fireEvent.click(nav); // Closes the sidebar
    fireEvent.click(nav); // Opens the sidebar
    expect(nav.className).toContain("sidebar open");
  });

  it("svg-container class changes with sidebar", () => {
    render(<Sidebar />);
    const nav = screen.getByTestId("sidebar-nav");
    const svgContainer = screen.getByTestId("svg-container");

    // Comprobar estado inicial
    expect(svgContainer.className).toContain("open");
    // Simular clic y comprobar cambio
    fireEvent.click(nav);
    expect(svgContainer.className).toContain("closed");
    // Otro clic para regresar al estado original
    fireEvent.click(nav);
    expect(svgContainer.className).toContain("open");
  });
});
