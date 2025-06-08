import React, { useState } from "react";
import { apiClient } from "../../../services/apiClient";
import RegistrationForm from "../components/RegistrationForm";
import { Box, Typography, Container, Card, CardContent, Divider, Link as MuiLink } from "@mui/material";
import { useLocation } from "react-router-dom";

const useFormField = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  return { value, onChange, setValue };
};

const RegistrationPage: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const name = useFormField("");
  const email = useFormField("");
  const password = useFormField("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginPage) {
        // Simulate login for now
        setTimeout(() => {
          setIsSuccess(true);
          setIsLoading(false);
        }, 1000);
      } else {
        await apiClient.registerUser({
          name: name.value,
          email: email.value,
          password: password.value,
        });
        setIsSuccess(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom color="primary">
              {isLoginPage ? "Welcome Back!" : "Registration Successful!"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isLoginPage ? `Welcome back, ${email.value}!` : `Welcome to the Digital Kudos Wall, ${name.value}!`}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card elevation={8} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 4,
            textAlign: "center",
            color: "white",
          }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isLoginPage ? "Welcome Back" : "Join Our Team"}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            {isLoginPage ? "Sign in to continue to Digital Kudos Wall" : "Create your account to start sharing kudos"}
          </Typography>
        </Box>

        <CardContent sx={{ p: 6 }}>
          <RegistrationForm
            name={name}
            email={email}
            password={password}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            isLoginMode={isLoginPage}
          />

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {isLoginPage ? "Don't have an account? " : "Already have an account? "}
              <MuiLink
                href={isLoginPage ? "/register" : "/login"}
                sx={{ fontWeight: "medium", textDecoration: "none" }}>
                {isLoginPage ? "Sign up here" : "Sign in here"}
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegistrationPage;
