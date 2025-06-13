import React from "react";
import { TextField, Button, Box, Alert } from "@mui/material";

interface RegistrationFormProps {
  name?: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  email: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  password: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  isLoginMode?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  name,
  email,
  password,
  onSubmit,
  isLoading,
  error,
  isLoginMode = false,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
      data-testid="registration-form">
      {error && (
        <Alert severity="error" data-testid="error-message">
          {error}
        </Alert>
      )}
      {!isLoginMode && name && (
        <TextField
          id="name"
          label="Full Name"
          type="text"
          value={name.value}
          onChange={name.onChange}
          required={!isLoginMode}
          variant="outlined"
          fullWidth
          inputProps={{ "data-testid": "name-input" }}
        />
      )}
      <TextField
        id="email"
        label="Email Address"
        type="email"
        value={email.value}
        onChange={email.onChange}
        required
        variant="outlined"
        fullWidth
        inputProps={{ "data-testid": "email-input" }}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={password.value}
        onChange={password.onChange}
        required
        variant="outlined"
        fullWidth
        inputProps={{ "data-testid": "password-input" }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        size="large"
        sx={{ mt: 2, py: 1.5 }}
        data-testid="register-button">
        {isLoading ? "Processing..." : isLoginMode ? "Sign in" : "Create account"}
      </Button>
    </Box>
  );
};

export default RegistrationForm;
