import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { LoginCredentials } from "../types/LoginCredentials";
import { Container, Paper, Typography, TextField, Button, Box, Link, Alert } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUseCase } = useAuthContext();
  const { login, isLoading, error } = useLogin({ loginUseCase });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credentials: LoginCredentials = { email, password };
      await login(credentials);
      setIsSuccess(true);

      navigate("/kudos");
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}>
          <Typography component="h1" variant="h5" data-testid="login-title">
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Sign in to continue to Digital Kudos Wall
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }} data-testid="login-error-message">
              {error}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }} data-testid="login-success-message">
              Login successful
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{
                "data-testid": "login-email-input",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{
                "data-testid": "login-password-input",
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              data-testid="login-submit-button">
              {isLoading ? "Processing..." : "Sign In"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link href="/register" variant="body2">
                Don't have an account? Sign up here
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
