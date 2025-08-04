import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "../../components/Header";
import * as React from "react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBranches: 0,
    activeEmployees: 0,
    totalDepartments: 0,
    totalEmployees: 0
  });
  const theme = useTheme();

  // Format audit log details for display
  const formatAuditLogTitle = (log) => {
    try {
      const action = log.action.toLowerCase();
      const entityType = log.entityType.charAt(0).toUpperCase() + log.entityType.slice(1).toLowerCase();
      return `${entityType} ${action}: ${log.details}`;
    } catch (err) {
      return 'Activity details unavailable';
    }
  };

  useEffect(() => {    const fetchAuditLogs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/audit/logs?page=0&size=10', {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch audit logs');
        const data = await response.json();
        
        // Handle paginated response
        if (data && data.content) {
          setAuditLogs(data.content);
        } else {
          console.error('Received invalid audit logs data:', data);
          setAuditLogs([]);
          setError('Invalid audit logs data received');
        }
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err.message);
        setAuditLogs([]); // Reset to empty array on error
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch branches
        const branchesResponse = await fetch('http://localhost:8080/api/branches/getBranches', {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
        });
        const branchesData = await branchesResponse.json();

        // Fetch employees
        const employeesResponse = await fetch('http://localhost:8080/api/employees/getEmployees', {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
        });
        const employeesData = await employeesResponse.json();

        // Fetch departments
        const departmentsResponse = await fetch('http://localhost:8080/api/department/getDepartments', {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
        });
        const departmentsData = await departmentsResponse.json();

        setStats({
          totalBranches: branchesData.length,
          activeEmployees: employeesData.filter(emp => emp.status === 'active').length,
          totalDepartments: departmentsData.length,
          totalEmployees: employeesData.length
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
    fetchStats();
  }, []);
  const recentActivities = React.useMemo(() => {
    if (!Array.isArray(auditLogs)) return [];
    
    return [...auditLogs]
      .sort((a, b) => {
        try {
          return new Date(b.timestamp) - new Date(a.timestamp);
        } catch (err) {
          return 0;
        }
      })
      .slice(0, 10)
      .map(log => {
        try {
          return {
            title: formatAuditLogTitle(log),
            time: `${log.entityType} ID: ${log.entityId}, Time: ${new Date(log.timestamp).toLocaleString()}`,
            performedBy: log.performedBy || 'System'
          };
        } catch (err) {
          return {
            title: 'Activity details unavailable',
            time: 'Timestamp unavailable',
            performedBy: 'Unknown'
          };
        }
      });
  }, [auditLogs]);

  const quickStats = [
    { label: "Total Branches", value: stats.totalBranches },
    { label: "Active Employees", value: stats.activeEmployees },
    { label: "Departments", value: stats.totalDepartments },
    { label: "Total Employees", value: stats.totalEmployees },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 4 }}>

        <Card sx={{ width: 350, bgcolor: theme.palette.background.paper, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="text.primary">
              Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
                sx={{
                  "& .MuiPickersDay-root": {
                    color: theme.palette.text.primary,
                    fontSize: "1.1rem", 
                  },
                }}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 300, bgcolor: theme.palette.background.paper, boxShadow: 3 }}>          <CardContent>
            <Typography variant="h4" gutterBottom color="text.primary">
              Recent Activities
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (              <List>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.secondary">
                                {activity.time}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2" color="text.secondary">
                                Performed by: {activity.performedBy}
                              </Typography>
                            </>
                          }
                          primaryTypographyProps={{ color: "text.primary" }}
                          secondaryTypographyProps={{ style: { marginTop: '4px' } }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText 
                      primary="No recent activities"
                      secondary="Activities will appear here as they occur"
                      primaryTypographyProps={{ color: "text.primary" }}
                      secondaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItem>
                )}
              </List>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250, bgcolor: theme.palette.background.paper, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="text.primary">
              Quick Stats
            </Typography>
            <Stack spacing={2} mt={2}>
              {quickStats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
