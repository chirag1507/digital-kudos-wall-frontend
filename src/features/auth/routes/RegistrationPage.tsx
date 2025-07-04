import React, { useState, useEffect } from "react";
import RegistrationForm from "../components/RegistrationForm";
import { Box, Typography, Container, Card, CardContent, Divider, Link as MuiLink } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useRegistration } from "../hooks/useRegistration";
import { useAuthContext } from "../hooks/useAuthContext";

const useFormField = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  return { value, onChange, setValue };
};

const RegistrationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";

  const justRegistered = location.state?.justRegistered;
  const registeredEmail = location.state?.email;

  const name = useFormField("");
  const email = useFormField("");
  const password = useFormField("");

  const { registerUserUseCase } = useAuthContext();
  const { error, isLoading, isSuccess, handleSubmit } = useRegistration({
    registerUserUseCase,
  });

  useEffect(() => {
    if (isSuccess && !isLoginPage) {
      navigate("/login", {
        state: {
          justRegistered: true,
          email: email.value,
        },
      });
    }
  }, [isSuccess, isLoginPage, navigate, email.value]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoginPage) {
      // In a real scenario, you'd call a login use case here.
    } else {
      await handleSubmit({
        name: name.value,
        email: email.value,
        password: password.value,
      });
    }
  };

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
          {isLoginPage && justRegistered && registeredEmail && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  p: 2,
                  backgroundColor: "success.light",
                  color: "success.contrastText",
                  borderRadius: 1,
                  textAlign: "center",
                }}
                data-testid="confirmation-message">
                Registration successful! A confirmation has been sent to {registeredEmail}
              </Typography>
            </Box>
          )}

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
