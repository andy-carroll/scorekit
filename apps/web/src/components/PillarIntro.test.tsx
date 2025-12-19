import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PillarIntro } from "./PillarIntro";

describe("PillarIntro", () => {
  const defaultProps = {
    pillarName: "Leadership & Vision",
    pillarDescription: "Assess executive commitment, strategy clarity, and investment appetite.",
    questionCount: 5,
    pillarNumber: 1,
    totalPillars: 5,
    onContinue: vi.fn(),
  };

  it("renders pillar name and description", () => {
    render(<PillarIntro {...defaultProps} />);

    expect(screen.getByText("Leadership & Vision")).toBeInTheDocument();
    expect(
      screen.getByText("Assess executive commitment, strategy clarity, and investment appetite.")
    ).toBeInTheDocument();
  });

  it("shows pillar progress (X of Y)", () => {
    render(<PillarIntro {...defaultProps} />);

    expect(screen.getByText(/SECTION 1 OF 5/)).toBeInTheDocument();
  });

  it("shows question count", () => {
    render(<PillarIntro {...defaultProps} />);

    expect(screen.getByText(/5 questions/)).toBeInTheDocument();
  });

  it("calls onContinue when button clicked", () => {
    const onContinue = vi.fn();
    render(<PillarIntro {...defaultProps} onContinue={onContinue} />);

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("handles singular question count", () => {
    render(<PillarIntro {...defaultProps} questionCount={1} />);

    expect(screen.getByText(/1 question/)).toBeInTheDocument();
  });
});
