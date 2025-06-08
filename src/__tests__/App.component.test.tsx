import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component", () => {
  test("renders Digital Kudos Wall heading", () => {
    render(<App />);
    const heading = screen.getByText(/digital kudos wall platform/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders registration form by default", () => {
    render(<App />);
    const emailField = screen.getByLabelText(/email address/i);
    expect(emailField).toBeInTheDocument();
  });
});
