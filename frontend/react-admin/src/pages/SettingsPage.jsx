import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { saveSettings, loadSettings } from "../utils/settingsApi";

const SettingsPage = () => {
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("GMT+5:30");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLogout, setAutoLogout] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    if (settings) {
      setLanguage(settings.language || "english");
      setTimezone(settings.timezone || "GMT+5:30");
      setEmail(settings.email || "");
      setNotifications(settings.notifications ?? true);
      setDarkMode(settings.darkMode ?? false);
      setAutoLogout(settings.autoLogout ?? false);
    }
  }, []);

  const handleSave = () => {
    saveSettings({ language, timezone, email, notifications, darkMode, autoLogout });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <FormControlLabel
            control={<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)} />}
            label="Enable Notifications"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />}
            label="Dark Mode"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Switch checked={autoLogout} onChange={e => setAutoLogout(e.target.checked)} />}
            label="Auto Logout after 10 minutes"
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Personalization
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="sinhala">සිංහල</MenuItem>
              <MenuItem value="tamil">தமிழ்</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={timezone}
              label="Timezone"
              onChange={(e) => setTimezone(e.target.value)}
            >
              <MenuItem value="GMT+5:30">GMT+5:30 (Sri Lanka)</MenuItem>
              <MenuItem value="GMT+0">GMT+0 (UTC)</MenuItem>
              <MenuItem value="GMT+8">GMT+8 (Singapore)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <TextField
            fullWidth
            label="Recovery Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter backup email"
            sx={{ mb: 3 }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 2, borderRadius: 3 }}
        onClick={handleSave}
      >
        Save Changes
      </Button>
      {saved && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          Settings saved!
        </Typography>
      )}
    </Box>
  );
};

export default SettingsPage;
