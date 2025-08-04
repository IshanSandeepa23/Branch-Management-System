import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Stack, Snackbar, Alert, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, DialogContentText
} from '@mui/material';
import Header from '../../components/Header';

export default function BranchesPage() {
  const [rows, setRows] = useState([]);
  const [newBranch, setNewBranch] = useState({
    branchid: '',
    branch_name: '',
    branch_location: '',
    created_date: '',
    branch_status: ''
  });
  const [editedBranch, setEditedBranch] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [licenseAccepted, setLicenseAccepted] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const userRole = 'admin';

  const columns = [
    { field: 'branchid', headerName: 'Branch ID', flex: 1 },
    { field: 'branch_name', headerName: 'Branch Name', flex: 1 },
    { field: 'branch_location', headerName: 'Branch Location', flex: 1 },
    { field: 'created_date', headerName: 'Created Date', flex: 1 },
    { field: 'branch_status', headerName: 'Status', flex: 1 },
  ];

  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/branches/getBranches', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const formattedData = data.map((item) => ({
        id: item.branchid,
        ...item
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAdd = () => {
    setNewBranch({ branchid: '', branch_name: '', branch_location: '', created_date: '', branch_status: '' });
    setLicenseAccepted(false);
    setOpenAddDialog(true);
  };

  const handleEdit = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can edit.', 'error');
      return;
    }
    setEditedBranch(null);
    setOpenEditDialog(true);
  };  

  const handleDelete = () => {
    if (userRole !== 'admin') {
      showAlert('Access Denied: Only Admins can delete.', 'error');
      return;
    }
    setSelectedBranch(null);
    setOpenDeleteDialog(true);
  };

  const handleSaveNewBranch = async () => {
    const today = new Date().toISOString().split('T')[0];
    const branchData = { ...newBranch, created_date: today };
    try {
      const response = await fetch('http://localhost:8080/api/branches/saveBranch', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(branchData),
      });
      if (response.ok) {
        showAlert('Branch saved successfully!', 'success');
        setOpenAddDialog(false);
        fetchBranches();
      } else {
        showAlert('Failed to save branch.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred.', 'error');
    }
  };

  const handleSaveEditBranch = async () => {
    if (!editedBranch || !editedBranch.branchid) {
      showAlert('Please select and modify a branch first.', 'warning');
      return;
    }
  
    try {
      const updatedBranchData = {
        branchid: editedBranch.branchid,
        branch_name: editedBranch.branch_name,
        branch_location: editedBranch.branch_location,
        created_date: editedBranch.created_date || new Date().toISOString().split('T')[0], // fallback
        branch_status: editedBranch.branch_status
      };
  
      const response = await fetch(`http://localhost:8080/api/branches/updateBranch/${editedBranch.branchid}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBranchData),
      });
  
      if (response.ok) {
        showAlert('Branch updated successfully!', 'success');
        setOpenEditDialog(false);
        fetchBranches();
      } else {
        showAlert('Failed to update branch.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while updating.', 'error');
    }
  };

  const handleConfirmDeleteBranch = async () => {
    if (!selectedBranch) {
      showAlert('Please select a branch to delete.', 'warning');
      return;
    }
    setConfirmDeleteDialog(true);
  };

  const executeDeleteBranch = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/branches/deleteBranch', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedBranch),
      });
      if (response.ok) {
        showAlert('Branch deleted successfully!', 'success');
        setOpenDeleteDialog(false);
        setConfirmDeleteDialog(false);
        fetchBranches();
      } else {
        showAlert('Failed to delete branch.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while deleting.', 'error');
    }
  };

  const handleInquiryChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to send inquiry to backend if needed
    setInquirySuccess(true);
    setInquiry({ name: '', email: '', message: '' });
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
        <Header title="Inquiry" subtitle="Request an inquiry" />

        {/* Inquiry Form */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            border: '1px solid',
            borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : '#ccc',
            borderRadius: 2,
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.95)' : '#fafafa',
            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
            boxShadow: (theme) => theme.palette.mode === 'dark' ? 8 : 2,
            width: '100%',
            maxWidth: 900,
            mx: 'auto'
          }}
        >
          <form onSubmit={handleInquirySubmit}>
            <Stack spacing={2}>
              <h2 style={{ textAlign: 'center', marginBottom: 0 }}>Inquiry Form</h2>
              <TextField
                label="Name"
                name="name"
                value={inquiry.name}
                onChange={handleInquiryChange}
                required
                InputLabelProps={{ style: { color: 'inherit' } }}
                InputProps={{
                  style: { color: 'inherit', background: 'transparent' }
                }}
                variant="filled"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={inquiry.email}
                onChange={handleInquiryChange}
                required
                InputLabelProps={{ style: { color: 'inherit' } }}
                InputProps={{
                  style: { color: 'inherit', background: 'transparent' }
                }}
                variant="filled"
              />
              <TextField
                label="Message"
                name="message"
                value={inquiry.message}
                onChange={handleInquiryChange}
                multiline
                rows={3}
                required
                InputLabelProps={{ style: { color: 'inherit' } }}
                InputProps={{
                  style: { color: 'inherit', background: 'transparent' }
                }}
                variant="filled"
              />
              <Button type="submit" variant="contained" sx={{ fontWeight: 'bold', py: 1.5 }}>
                Submit Inquiry
              </Button>
              {inquirySuccess && (
                <Alert severity="success" onClose={() => setInquirySuccess(false)}>
                  Inquiry submitted successfully!
                </Alert>
              )}
            </Stack>
          </form>
        </Box>

        {/* Remove the DataGrid and related controls */}
        {/* <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" color="success" onClick={handleAdd}>Add</Button>
          <Button variant="contained" color="secondary"  onClick={handleEdit}>Edit</Button>
          <Button variant="contained" color="error" sx={{ color: 'white' }} onClick={handleDelete}>Delete</Button>
        </Stack>

        <DataGrid
          loading={!rows.length}
          rows={rows}
          columns={columns}
          pageSize={5}
        /> */}
      </Box>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Branch ID" value={newBranch.branchid} onChange={(e) => setNewBranch({ ...newBranch, branchid: e.target.value })} required />
          <TextField label="Branch Name" value={newBranch.branch_name} onChange={(e) => setNewBranch({ ...newBranch, branch_name: e.target.value })} required />
          <TextField label="Branch Location" value={newBranch.branch_location} onChange={(e) => setNewBranch({ ...newBranch, branch_location: e.target.value })} required />
          <TextField label="Branch Status" value={newBranch.branch_status} onChange={(e) => setNewBranch({ ...newBranch, branch_status: e.target.value })} required />
          <FormControlLabel
            control={<Checkbox checked={licenseAccepted} onChange={(e) => setLicenseAccepted(e.target.checked)} color="primary" />}
            label="I agree to the terms and conditions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNewBranch} disabled={!licenseAccepted}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Select Branch</InputLabel>
            <Select
              value={editedBranch?.branchid || ''}
              label="Select Branch"
              onChange={(e) => {
                const selected = rows.find(r => r.branchid === e.target.value);
                setEditedBranch({ ...selected });
              }}
            >
              {rows.map((branch) => (
                <MenuItem key={branch.branchid} value={branch.branchid}>
                  {branch.branchid} - {branch.branch_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {editedBranch && (
            <>
              <TextField label="Branch Name" value={editedBranch.branch_name} onChange={(e) => setEditedBranch({ ...editedBranch, branch_name: e.target.value })} />
              <TextField label="Branch Location" value={editedBranch.branch_location} onChange={(e) => setEditedBranch({ ...editedBranch, branch_location: e.target.value })} />
              <TextField label="Branch Status" value={editedBranch.branch_status} onChange={(e) => setEditedBranch({ ...editedBranch, branch_status: e.target.value })} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditBranch}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Branch</InputLabel>
            <Select
              value={selectedBranch?.branchid || ''}
              label="Select Branch"
              onChange={(e) => {
                const selected = rows.find(r => r.branchid === e.target.value);
                setSelectedBranch({ ...selected });
              }}
            >
              {rows.map((branch) => (
                <MenuItem key={branch.branchid} value={branch.branchid}>
                  {branch.branchid} - {branch.branch_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteBranch}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this branch?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={executeDeleteBranch}>Yes, Delete</Button>
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