import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Branches from "./scenes/branches";
import Employees from "./scenes/employees";
import Departments from "./scenes/departments";
import Form from "./scenes/form";
import AuditLogs from "./scenes/audit";
import Login from "./Login"; 
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import SettingsPage from "./pages/SettingsPage";
import { loadSettings } from "./utils/settingsApi";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState(loadSettings() || {});
  const logoutTimer = useRef(null);

  // Listen for settings changes in localStorage
  useEffect(() => {
    const onStorage = () => setSettings(loadSettings() || {});
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Apply dark mode setting
  useEffect(() => {
    if (settings.darkMode !== undefined && colorMode) {
      if (settings.darkMode && theme.palette.mode !== 'dark') colorMode.toggleColorMode();
      if (!settings.darkMode && theme.palette.mode !== 'light') colorMode.toggleColorMode();
    }
    // eslint-disable-next-line
  }, [settings.darkMode]);

  // Auto logout after 10 minutes of inactivity if enabled
  useEffect(() => {
    if (!settings.autoLogout) {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      return;
    }
    const resetTimer = () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        window.location.reload();
      }, 10 * 60 * 1000); // 10 minutes
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [settings.autoLogout]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/form" element={<Form />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit" element={<AuditLogs />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
