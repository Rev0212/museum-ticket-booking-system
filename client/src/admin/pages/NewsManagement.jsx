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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getNews, createNews, updateNews, deleteNews } from '../utils/adminApi';

const NewsForm = ({ open, onClose, article, onSave }) => {
  const initialState = {
    title: '',
    content: '',
    imageUrl: '',
    source: '',
    category: 'general',
    url: ''
  };
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData(initialState);
    }
  }, [article]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (article) {
        await updateNews(article._id, formData);
        setSnackbar({
          open: true,
          message: 'Article updated successfully',
          severity: 'success'
        });
      } else {
        await createNews(formData);
        setSnackbar({
          open: true,
          message: 'Article created successfully',
          severity: 'success'
        });
      }
      onSave();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save article',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {article ? 'Edit News Article' : 'Add News Article'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              error={Boolean(errors.title)}
              helperText={errors.title}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={6}
              required
              error={Boolean(errors.content)}
              helperText={errors.content}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="exhibition">Exhibition</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="update">Update</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : (article ? 'Update' : 'Create')}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
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
    </>
  );
};

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const data = await getNews();
      setNews(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load news articles',
        severity: 'error'
      });
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNews();
  }, []);
  
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteNews(id);
        fetchNews(); // Refresh list
        setSnackbar({
          open: true,
          message: 'Article deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete article',
          severity: 'error'
        });
        console.error('Error deleting article:', error);
      }
    }
  };
  
  const handleFormClose = () => {
    setSelectedArticle(null);
    setOpen(false);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          News Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedArticle(null);
            setOpen(true);
          }}
        >
          Add New Article
        </Button>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((article) => (
                <TableRow key={article._id} hover>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={article.category}
                      color={
                        article.category === 'exhibition' ? 'secondary' :
                        article.category === 'event' ? 'success' :
                        article.category === 'update' ? 'primary' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(article)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => handleDelete(article._id)}
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
      
      <NewsForm
        open={open}
        onClose={handleFormClose}
        article={selectedArticle}
        onSave={fetchNews}
      />
      
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

export default NewsManagement;