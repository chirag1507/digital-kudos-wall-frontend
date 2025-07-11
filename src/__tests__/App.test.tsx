import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("App", () => {
  it("renders the main heading", () => {
    render(<App />);
    const headingElement = screen.getByText(/Digital Kudos Wall Platform/i);
    expect(headingElement).toBeInTheDocument();
  });
});
