import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionProgress } from "./SectionProgress";

describe("SectionProgress", () => {
  const sections = [
    { id: "context-start", name: "About Your Business", completed: true },
    { id: "leadership", name: "Leadership & Vision", completed: true },
    { id: "data", name: "Data & Infrastructure", completed: false },
    { id: "people", name: "People & Skills", completed: false },
    { id: "process", name: "Process & Operations", completed: false },
    { id: "culture", name: "Culture & Experimentation", completed: false },
    { id: "context-end", name: "Your Goals", completed: false },
  ];

  it("renders all section names", () => {
    render(<SectionProgress sections={sections} currentSectionId="data" />);

    expect(screen.getByText("About Your Business")).toBeInTheDocument();
    expect(screen.getByText("Leadership & Vision")).toBeInTheDocument();
    expect(screen.getByText("Data & Infrastructure")).toBeInTheDocument();
  });

  it("shows checkmarks for completed sections", () => {
    render(<SectionProgress sections={sections} currentSectionId="data" />);

    // Completed sections should have checkmark
    const checkmarks = screen.getAllByTestId("section-complete");
    expect(checkmarks).toHaveLength(2);
  });

  it("highlights current section", () => {
    render(<SectionProgress sections={sections} currentSectionId="data" />);

    const currentSection = screen.getByTestId("section-current");
    expect(currentSection).toHaveTextContent("Data & Infrastructure");
  });

  it("shows pending state for future sections", () => {
    render(<SectionProgress sections={sections} currentSectionId="data" />);

    const pendingSections = screen.getAllByTestId("section-pending");
    expect(pendingSections.length).toBeGreaterThan(0);
  });
});
