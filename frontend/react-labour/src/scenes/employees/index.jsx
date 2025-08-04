import React from 'react';
import { Box, Typography, LinearProgress, Card, CardContent, Stack, Grid } from '@mui/material';
import Header from '../../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeesPage() {
  // Hardcoded values for demonstration
  const attendance = 85;
  const leavesTaken = 4;
  const tasksCompleted = 27;
  const totalTasks = 30;

  const progressData = [
    { month: 'Jan', progress: 60 },
    { month: 'Feb', progress: 65 },
    { month: 'Mar', progress: 70 },
    { month: 'Apr', progress: 75 },
    { month: 'May', progress: 80 },
    { month: 'Jun', progress: 85 },
    { month: 'Jul', progress: 90 },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        p: { xs: 2, md: 6 },
        boxSizing: 'border-box',
      }}
    >
      <Header
        title="Employee Dashboard"
        subtitle="Welcome to your personal dashboard"
        sx={{ mb: 6, fontSize: { xs: 32, md: 48 } }}
      />

      <Grid container spacing={6} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                Attendance
              </Typography>
              <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
                {attendance}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={attendance}
                sx={{
                  height: 32,
                  borderRadius: 3,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#222' : '#eee',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                    transition: 'background-color 0.3s',
                  },
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0,0,0,0.7)'
                      : '0 2px 8px rgba(25, 118, 210, 0.15)',
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                Leaves Taken
              </Typography>
              <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                {leavesTaken}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                This year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                Tasks Completed
              </Typography>
              <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
                {tasksCompleted}/{totalTasks}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, width: '100%', height: { xs: 300, md: 500 } }}>
        <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 4 }}>
          <CardContent sx={{ height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Self Progress Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" style={{ fontSize: 18 }} />
                <YAxis domain={[0, 100]} style={{ fontSize: 18 }} />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#1976d2" strokeWidth={5} dot={{ r: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
