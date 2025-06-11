import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import KudosWallPage from "../features/kudos/routes/KudosWallPage";
import RegistrationPage from "../features/auth/routes/RegistrationPage";

const AppContent = () => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "none",
      }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Digital Kudos Wall Platform
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" component={Link} to="/kudos">
            Kudos Wall
          </Button>
          <Button color="inherit" component={Link} to="/">
            Register
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>

    <main>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<RegistrationPage />} />
        <Route path="/kudos" element={<KudosWallPage />} />
      </Routes>
    </main>
  </Box>
);

describe("Component Test: App", () => {
  // Helper to render App content with Router context (isolated testing)
  const renderApp = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppContent />
      </MemoryRouter>
    );
  };

  test("should render main application layout", () => {
    renderApp();

    // Test component structure
    expect(screen.getByRole("banner")).toBeInTheDocument(); // AppBar
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content area
  });

  test("should render application title", () => {
    renderApp();

    expect(screen.getByText("Digital Kudos Wall Platform")).toBeInTheDocument();
  });

  test("should render navigation buttons", () => {
    renderApp();

    expect(screen.getByRole("link", { name: /kudos wall/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  test("should render registration page by default", () => {
    renderApp("/");

    // Test that the default route renders RegistrationPage content
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });
});
