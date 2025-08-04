import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Stack, Snackbar, Alert, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, DialogContentText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../components/Header';

export default function EmployeesPage() {
  const [rows, setRows] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employeeid: '',
    name: '',
    job_role: '',
    email: '',
  });
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [licenseAccepted, setLicenseAccepted] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const userRole = 'admin';

  const columns = [
    { field: 'employeeid', headerName: 'Employee ID', flex: 1 },
    { field: 'name', headerName: 'Employee Name', flex: 1 },
    { field: 'job_role', headerName: 'Job Role', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
  ];

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employees/getEmployees', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const formattedData = data.map((item) => ({
        id: item.employeeid,
        ...item
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAdd = () => {
    setNewEmployee({ employeeid: '', name: '', job_role: '', email: '' });
    setLicenseAccepted(false);
    setOpenAddDialog(true);
  };

  const handleEdit = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can edit.', 'error');
      return;
    }
    setEditedEmployee(null);
    setOpenEditDialog(true);
  };

  const handleDelete = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can delete.', 'error');
      return;
    }
    setSelectedEmployee(null);
    setOpenDeleteDialog(true);
  };

  const handleSaveNewEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employees/createEmployee', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        showAlert('Employee saved successfully!', 'success');
        setOpenAddDialog(false);
        fetchEmployees();
      } else {
        showAlert('Failed to save employee.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred.', 'error');
    }
  };

  const handleSaveEditEmployee = async () => {
    if (!editedEmployee || !editedEmployee.employeeid) {
      showAlert('Please select and modify an employee first.', 'warning');
      return;
    }

    try {
      const updatedEmployeeData = {
        employeeid: editedEmployee.employeeid,
        name: editedEmployee.name,
        job_role: editedEmployee.job_role,
        email: editedEmployee.email,
      };

      const response = await fetch(`http://localhost:8080/api/employees/updateEmployee/${editedEmployee.employeeid}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEmployeeData),
      });

      if (response.ok) {
        showAlert('Employee updated successfully!', 'success');
        setOpenEditDialog(false);
        fetchEmployees();
      } else {
        showAlert('Failed to update employee.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while updating.', 'error');
    }
  };

  const handleConfirmDeleteEmployee = async () => {
    if (!selectedEmployee) {
      showAlert('Please select an employee to delete.', 'warning');
      return;
    }
    setConfirmDeleteDialog(true);
  };

  const executeDeleteEmployee = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employees/deleteEmployee', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedEmployee),
      });
      if (response.ok) {
        showAlert('Employee deleted successfully!', 'success');
        setOpenDeleteDialog(false);
        setConfirmDeleteDialog(false);
        fetchEmployees();
      } else {
        showAlert('Failed to delete employee.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while deleting.', 'error');
    }
  };

  return (
    <Box sx={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
      <Header title="Employees" subtitle="List of employees" sx={{ mb: 4 }} />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" color="success" onClick={handleAdd}>Add</Button>
        <Button variant="contained" color="secondary" onClick={handleEdit}>Edit</Button>
        <Button variant="contained" color="error" sx={{ color: 'white' }} onClick={handleDelete}>Delete</Button>
      </Stack>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          loading={!rows.length}
          rows={rows}
          columns={columns}
          pageSize={5}
        />
      </Box>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Employee ID" value={newEmployee.employeeid} onChange={(e) => setNewEmployee({ ...newEmployee, employeeid: e.target.value })} required />
          <TextField label="Employee Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
          <TextField label="Job Role" value={newEmployee.job_role} onChange={(e) => setNewEmployee({ ...newEmployee, job_role: e.target.value })} required />
          <TextField label="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
          <FormControlLabel
            control={<Checkbox checked={licenseAccepted} onChange={(e) => setLicenseAccepted(e.target.checked)} color="primary" />}
            label="I agree to the terms and conditions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNewEmployee} disabled={!licenseAccepted}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={editedEmployee?.employeeid || ''}
              label="Select Employee"
              onChange={(e) => {
                const selected = rows.find(r => r.employeeid === e.target.value);
                setEditedEmployee({ ...selected });
              }}
            >
              {rows.map((employee) => (
                <MenuItem key={employee.employeeid} value={employee.employeeid}>
                  {employee.employeeid} - {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {editedEmployee && (
            <>
              <TextField label="Employee Name" value={editedEmployee.name} onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })} />
              <TextField label="Job Role" value={editedEmployee.job_role} onChange={(e) => setEditedEmployee({ ...editedEmployee, job_role: e.target.value })} />
              <TextField label="Email" value={editedEmployee.email} onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditEmployee}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployee?.employeeid || ''}
              label="Select Employee"
              onChange={(e) => {
                const selected = rows.find(r => r.employeeid === e.target.value);
                setSelectedEmployee({ ...selected });
              }}
            >
              {rows.map((employee) => (
                <MenuItem key={employee.employeeid} value={employee.employeeid}>
                  {employee.employeeid} - {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteEmployee}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this employee?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={executeDeleteEmployee}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
