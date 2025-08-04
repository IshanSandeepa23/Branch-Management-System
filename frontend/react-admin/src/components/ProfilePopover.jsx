import React, { useState } from "react";
import {
  IconButton,
  Avatar,
  Popover,
  Typography,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate("/settingspage");
    handleClose();
  };

  const handleLogout = () => {
    alert("Logged out");
    navigate("/login")
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ ml: 1 }}>
        <Avatar alt="User" icon={<AccountCircleIcon />} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 220, borderRadius: 2 } }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Admin User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manager
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Popover>
    </>
  );
};

export default ProfilePopover;
