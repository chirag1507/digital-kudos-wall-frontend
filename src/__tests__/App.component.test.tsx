import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component", () => {
  test("renders Digital Kudos Wall heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /digital kudos wall/i });
    expect(heading).toBeInTheDocument();
  });

  test("renders welcome message", () => {
    render(<App />);
    const welcomeText = screen.getByText(/welcome to the digital kudos wall/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(<App />);
    const descriptionText = screen.getByText(/a place to give and receive kudos/i);
    expect(descriptionText).toBeInTheDocument();
  });
});
