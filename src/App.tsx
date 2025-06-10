import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./App.css";
import KudosWallPage from "./features/kudos/routes/KudosWallPage";
import RegistrationPage from "./features/auth/routes/RegistrationPage";

// Kicking off the CI/CD pipeline to test the full contract testing flow.
function App(): JSX.Element {
  // Test comment to trigger new build
  return (
    <Router>
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
    </Router>
  );
}

export default App;
