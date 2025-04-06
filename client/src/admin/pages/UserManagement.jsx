import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });
  
  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Get the token
      const token = localStorage.getItem('token');
      
      // This would ideally be in your API utility file
      const response = await axios.get('http://localhost:5001/api/auth/users', {
        headers: { 'x-auth-token': token }
      });
      
      // For development/testing, use mock data if API is not ready
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'user' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', role: 'user' },
        { _id: '3', name: 'Admin User', email: 'admin@example.com', phone: '345-678-9012', role: 'admin' }
      ];
      
      setUsers(response.data || mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock data for development if API fails
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'user' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', role: 'user' },
        { _id: '3', name: 'Admin User', email: 'admin@example.com', phone: '345-678-9012', role: 'admin' }
      ];
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleView = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setViewMode(true);
    setOpen(true);
  };
  
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setViewMode(false);
    setOpen(true);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5001/api/auth/user/${selectedUser._id}`, formData, {
        headers: { 'x-auth-token': token }
      });
      
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      
      setOpen(false);
      fetchUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user',
        severity: 'error'
      });
      console.error('Error updating user:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(`http://localhost:5001/api/auth/user/${id}`, {
          headers: { 'x-auth-token': token }
        });
        
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
        
        fetchUsers();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete user',
          severity: 'error'
        });
        console.error('Error deleting user:', error);
      }
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleView(user)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === 'admin'} // Prevent deleting admin users
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {viewMode ? 'User Details' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              InputProps={{ readOnly: viewMode }}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ readOnly: viewMode }}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              InputProps={{ readOnly: viewMode }}
              margin="normal"
            />
            
            {viewMode ? (
              <TextField
                fullWidth
                label="Role"
                value={formData.role}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
            ) : (
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          {!viewMode && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          )}
          <Button onClick={() => setOpen(false)}>
            {viewMode ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;