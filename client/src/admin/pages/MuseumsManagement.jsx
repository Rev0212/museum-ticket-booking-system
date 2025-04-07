import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Chip,
  CircularProgress,
  Paper,
  TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuseumForm from '../components/museums/MuseumForm';
import { getMuseums, deleteMuseum } from '../utils/adminApi';

const MuseumsManagement = () => {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  // Fetch museums
  const fetchMuseums = async () => {
    try {
      setIsLoading(true);
      const data = await getMuseums();
      setMuseums(data);
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMuseums();
  }, []);
  
  // Handle edit museum
  const handleEdit = (museum) => {
    setSelectedMuseum(museum);
    setOpen(true);
  };
  
  // Handle delete museum
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this museum?')) {
      try {
        await deleteMuseum(id);
        fetchMuseums(); // Refresh list
      } catch (error) {
        console.error('Error deleting museum:', error);
      }
    }
  };
  
  // Handle form close and refresh
  const handleFormClose = (refreshData = false) => {
    setSelectedMuseum(null);
    setOpen(false);
    if (refreshData) fetchMuseums();
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Museums Management</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedMuseum(null);
            setOpen(true);
          }}
        >
          Add New Museum
        </Button>
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {museums.map((museum) => (
                <TableRow key={museum._id}>
                  <TableCell>{museum.name}</TableCell>
                  <TableCell>
                    {museum.location?.city}, {museum.location?.state}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={museum.featured ? "success" : "default"}
                      label={museum.featured ? "Featured" : "Standard"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />} 
                        onClick={() => handleEdit(museum)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<DeleteIcon />} 
                        color="error"
                        onClick={() => handleDelete(museum._id)}
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
      
      <MuseumForm 
        open={open} 
        onClose={handleFormClose} 
        museum={selectedMuseum} 
      />
    </Box>
  );
};

export default MuseumsManagement;