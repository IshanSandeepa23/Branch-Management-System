import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../components/Header';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [entityType, setEntityType] = useState('Branch');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/audit/${entityType}?page=${paginationModel.page}&size=${paginationModel.pageSize}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.content) {
        throw new Error('Invalid response format');
      }

      setLogs(data.content);
      setTotalRows(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setAlertSeverity('error');
      setAlertMessage(`Failed to load audit logs: ${error.message}`);
      setAlertOpen(true);
      setLogs([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [entityType, paginationModel.page, paginationModel.pageSize]);

  const handleEntityTypeChange = (event) => {
    setEntityType(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on type change
  };

  const columns = [
    { 
      field: 'timestamp', 
      headerName: 'Timestamp', 
      flex: 1,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleString();
        } catch (e) {
          return params.value;
        }
      }
    },
    { field: 'entityType', headerName: 'Entity Type', flex: 1 },
    { field: 'entityId', headerName: 'Entity ID', flex: 1 },
    { field: 'action', headerName: 'Action', flex: 1 },
    { field: 'details', headerName: 'Details', flex: 2 },
    { field: 'performedBy', headerName: 'Performed By', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="AUDIT LOGS" subtitle="View system activity" />

      <Box mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Entity Type</InputLabel>
          <Select
            value={entityType}
            label="Entity Type"
            onChange={handleEntityTypeChange}
          >
            <MenuItem value="Branch">Branch</MenuItem>
            <MenuItem value="Department">Department</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box height="75vh">
        <DataGrid
          rows={logs}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalRows}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationMode="server"
          getRowId={(row) => `${row.id || row.timestamp}-${row.entityId}-${row.action}`}
        />
      </Box>

      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLogsPage;
