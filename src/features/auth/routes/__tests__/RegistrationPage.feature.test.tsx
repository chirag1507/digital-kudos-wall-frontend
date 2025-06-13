import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistrationPage from "../RegistrationPage";
import { useRegistration } from "../../hooks/useRegistration";
import { PageFactory } from "@/__tests__/page-objects";

// Mock the useRegistration hook
jest.mock("../../hooks/useRegistration", () => ({
  useRegistration: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseRegistration = useRegistration as jest.Mock;

describe("Feature Test: User Registration", () => {
  const renderComponent = (initialRoute = "/register") => {
    const { container } = render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <RegistrationPage />
      </MemoryRouter>
    );
    const page = PageFactory.createRegistrationFormPage(container);
    return { container, page };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when registration is successful", () => {
    it("should redirect to login page", async () => {
      // Arrange: Mock a successful registration state
      const mockHandleSubmit = jest.fn();
      mockUseRegistration.mockReturnValue({
        error: null,
        isLoading: false,
        isSuccess: true, // Registration is successful
        handleSubmit: mockHandleSubmit,
      });

      const { page } = renderComponent();
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "ValidPassword123!",
      };

      // Act: Fill out the form and submit
      page.performRegistration(user.name, user.email, user.password);

      // Assert: Verify that the handleSubmit function was called
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      // Assert: Verify navigation to login page with state
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        state: {
          justRegistered: true,
          email: user.email,
        },
      });
    });
  });

  describe("when registration fails", () => {
    it("should display an error message on the form", async () => {
      // Arrange: Mock a failed registration state
      const mockHandleSubmit = jest.fn();
      mockUseRegistration.mockReturnValue({
        error: "This email is already in use.",
        isLoading: false,
        isSuccess: false,
        handleSubmit: mockHandleSubmit,
      });

      const { page } = renderComponent();
      const user = {
        name: "John Doe",
        email: "existing@example.com",
        password: "ValidPassword123!",
      };

      // Act
      page.performRegistration(user.name, user.email, user.password);

      // Assert
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      page.shouldShowError("This email is already in use.");
    });
  });
});
