import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Stack, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, DialogContentText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../components/Header';

export default function DepartmentsPage() {
  const [rows, setRows] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    departmentID: '',
    departmentName: '',
  });
  const [editedDepartment, setEditedDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const userRole = 'admin';
  const columns = [
    { field: 'departmentID', headerName: 'Department ID', flex: 1 },
    { field: 'departmentName', headerName: 'Department Name', flex: 1 },
  ];

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/department/getDepartments', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const formattedData = data.map((item) => ({
        id: item.departmentID,
        ...item
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAdd = () => {
    setNewDepartment({ departmentID: '', departmentName: '' });
    setOpenAddDialog(true);
  };

  const handleEdit = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can edit.', 'error');
      return;
    }
    setEditedDepartment(null);
    setOpenEditDialog(true);
  };

  const handleDelete = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can delete.', 'error');
      return;
    }
    setSelectedDepartment(null);
    setOpenDeleteDialog(true);
  };

  const handleSaveNewDepartment = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/department/createDepartment', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDepartment),
      });
      if (response.ok) {
        showAlert('Department saved successfully!', 'success');
        setOpenAddDialog(false);
        fetchDepartments();
      } else {
        showAlert('Failed to save department.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred.', 'error');
    }
  };

  const handleSaveEditDepartment = async () => {
    if (!editedDepartment || !editedDepartment.departmentID) {
      showAlert('Please select and modify a department first.', 'warning');
      return;
    }

    try {
      const updatedDepartmentData = {
        departmentID: editedDepartment.departmentID,
        departmentName: editedDepartment.departmentName,
      };

      const response = await fetch(`http://localhost:8080/api/department/updateDepartment/${editedDepartment.departmentID}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDepartmentData),
      });

      if (response.ok) {
        showAlert('Department updated successfully!', 'success');
        setOpenEditDialog(false);
        fetchDepartments();
      } else {
        showAlert('Failed to update department.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while updating.', 'error');
    }
  };

  const handleConfirmDeleteDepartment = async () => {
    if (!selectedDepartment) {
      showAlert('Please select a department to delete.', 'warning');
      return;
    }
    setConfirmDeleteDialog(true);
  };

  const executeDeleteDepartment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/department/deleteDepartment/${selectedDepartment.departmentID}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
          // No body!
        }
      );
      if (response.ok) {
        showAlert('Department deleted successfully!', 'success');
        setOpenDeleteDialog(false);
        setConfirmDeleteDialog(false);
        fetchDepartments();
      } else {
        showAlert('Failed to delete department.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while deleting.', 'error');
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
        <Header 
          title="Departments" 
          subtitle="List of departments" 
        />

        <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
          <Button variant="contained" color="success" onClick={handleAdd}>Add</Button>
          <Button variant="contained" color="secondary" onClick={handleEdit}>Edit</Button>
          <Button variant="contained" color="error" sx={{ color: 'white' }} onClick={handleDelete}>Delete</Button>
        </Stack>

        <DataGrid
          loading={!rows.length}
          rows={rows}
          columns={columns}
          pageSize={5}
          autoHeight
        />
      </Box>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Department ID" value={newDepartment.departmentID} onChange={(e) => setNewDepartment({ ...newDepartment, departmentID: e.target.value })} required />
          <TextField label="Department Name" value={newDepartment.departmentName} onChange={(e) => setNewDepartment({ ...newDepartment, departmentName: e.target.value })} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNewDepartment}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={editedDepartment?.departmentID || ''}
              label="Select Department"
              onChange={(e) => {
                const selected = rows.find(r => r.departmentID === e.target.value);
                setEditedDepartment({ ...selected });
              }}
            >
              {rows.map((department) => (
                <MenuItem key={department.departmentID} value={department.departmentID}>
                  {department.departmentID} - {department.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {editedDepartment && (
            <TextField label="Department Name" value={editedDepartment.departmentName} onChange={(e) => setEditedDepartment({ ...editedDepartment, departmentName: e.target.value })} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditDepartment}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={selectedDepartment?.departmentID || ''}
              label="Select Department"
              onChange={(e) => {
                const selected = rows.find(r => r.departmentID === e.target.value);
                setSelectedDepartment({ ...selected });
              }}
            >
              {rows.map((department) => (
                <MenuItem key={department.departmentID} value={department.departmentID}>
                  {department.departmentID} - {department.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteDepartment}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this department?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={executeDeleteDepartment}>Yes, Delete</Button>
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
