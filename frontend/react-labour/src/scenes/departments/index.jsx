import React, { useState } from 'react';
import { Box, Stack, Typography, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../../components/Header';

export default function DepartmentsPage() {
  // Example notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Update', message: 'The system will be updated at 10:00 PM tonight.', read: false },
    { id: 2, title: 'New Department Added', message: 'A new department has been added to the system.', read: false },
    { id: 3, title: 'Reminder', message: 'Please review your department details.', read: true }
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setSnackbar({ open: true, message: 'Notification marked as read.', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
        <Header title="Notifications" subtitle="View your latest notifications" />
        <Stack spacing={2} sx={{ mt: 3 }}>
          {notifications.length === 0 && (
            <Typography variant="body1">No notifications.</Typography>
          )}
          {notifications.map((notification) => (
            <Paper
              key={notification.id}
              elevation={notification.read ? 1 : 4}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                background: notification.read ? 'action.hover' : 'background.paper',
                opacity: notification.read ? 0.7 : 1
              }}
            >
              <NotificationsIcon color={notification.read ? 'disabled' : 'primary'} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={notification.read ? 'normal' : 'bold'}>
                  {notification.title}
                </Typography>
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
              {!notification.read && (
                <IconButton
                  aria-label="mark as read"
                  onClick={() => handleMarkAsRead(notification.id)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          ))}
        </Stack>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
