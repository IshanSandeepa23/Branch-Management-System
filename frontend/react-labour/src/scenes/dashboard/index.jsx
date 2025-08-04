import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const teamPerformanceData = [
  { name: "Team A", completed: 24, pending: 6 },
  { name: "Team B", completed: 18, pending: 12 },
  { name: "Team C", completed: 30, pending: 2 },
  { name: "Team D", completed: 15, pending: 15 },
];

const quickActions = [
  { label: "Approve Leaves", action: () => alert("Approve Leaves clicked") },
  { label: "Assign Task", action: () => alert("Assign Task clicked") },
  { label: "View Reports", action: () => alert("View Reports clicked") },
];

const summaryStats = [
  { label: "Total Teams", value: 4 },
  { label: "Total Employees", value: 120 },
  { label: "Pending Approvals", value: 7 },
  { label: "Open Tasks", value: 33 },
];

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box m="20px">
      <Header title="MANAGER'S DASHBOARD" subtitle="Overview and quick actions" />
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4, bgcolor: "background.paper", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="text.primary" gutterBottom>
                Team Performance Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill={theme.palette.primary.main} name="Completed Tasks" />
                  <Bar dataKey="pending" fill={theme.palette.error.main} name="Pending Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ bgcolor: "background.paper", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Summary
                </Typography>
                <Stack spacing={1}>
                  {summaryStats.map((stat, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="text.secondary">{stat.label}</Typography>
                      <Typography color="text.primary" fontWeight="bold">{stat.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ bgcolor: "background.paper", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  {quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
