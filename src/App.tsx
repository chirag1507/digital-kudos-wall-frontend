import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./App.css";
import KudosWallPage from "./features/kudos/routes/KudosWallPage";
import RegistrationPage from "./features/auth/routes/RegistrationPage";
import { LoginPage } from "./features/auth/routes/LoginPage";
import { AuthProvider } from "./features/auth/providers/AuthProvider";

function App(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/kudos" element={<KudosWallPage />} />
            </Routes>
          </main>
        </Box>
      </AuthProvider>
    </Router>
  );
}

export default App;
