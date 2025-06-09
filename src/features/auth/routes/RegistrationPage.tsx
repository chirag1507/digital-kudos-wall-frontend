import React, { useState } from "react";
import RegistrationForm from "../components/RegistrationForm";
import { Box, Typography, Container, Card, CardContent, Divider, Link as MuiLink } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useRegistration } from "../hooks/useRegistration";

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

  const { error, isLoading, isSuccess, handleSubmit } = useRegistration();

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoginPage) {
      // Simulate login for now
      console.log("Simulating login...");
      // In a real scenario, you'd call a login use case here.
    } else {
      await handleSubmit({
        name: name.value,
        email: email.value,
        password: password.value,
      });
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
              {isLoginPage ? `Welcome back, ${email.value}!` : `Welcome to the Digital Kudos Wall, ${email.value}!`}
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
            onSubmit={handleFormSubmit}
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
