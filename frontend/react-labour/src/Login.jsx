import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import backgroundImage from "./assets/bg.jpg";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "bmsemp" && password === "emp1234") {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        color: "#fff",
        px: 6,
        py: 4,
        '&::before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        },
      }}
    >

      <Box
        sx={{
          flex: 1,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pl: 4,
        }}
      >
        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: "Georgia", mb: 1 }}>
          Branch
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: "Georgia", mb: 1 }}>
          Management
        </Typography>
        <Typography variant="h2" fontWeight="bold" sx={{ fontFamily: "Georgia" }}>
          System
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pr: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            width: "100%",
            maxWidth: 400,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            color: "#fff",
          }}
        >
          <Typography variant="h4" align="center" mb={2} fontWeight="bold">
            Welcome back,
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
              alt="Login Icon"
              style={{ width: 60 }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Typography variant="body1" fontWeight="medium" mb={0.5}>
              Username
            </Typography>
            <TextField
              placeholder="Enter username"
              fullWidth
              variant="outlined"
              margin="dense"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: "#000",
                },
              }}
            />

            <Typography variant="body1" fontWeight="medium" mt={2} mb={0.5}>
              Password
            </Typography>
            <TextField
              placeholder="Enter password"
              fullWidth
              type="password"
              variant="outlined"
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  color: "#000", 
                },
              }}
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <FormControlLabel
                control={<Checkbox sx={{ color: "#fff" }} />}
                label="Remember me"
                sx={{ color: "#fff" }}
              />
              <Link href="#" underline="hover" sx={{ color: "#fff", fontSize: "0.9rem" }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: "#2196f3",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 8,
                height: 45,
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
