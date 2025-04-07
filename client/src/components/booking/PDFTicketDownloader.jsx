import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { downloadTicketPDF } from '../../utils/api';

const PDFTicketDownloader = ({ bookingId }) => {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      setError('');
      
      await downloadTicketPDF(bookingId);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <PictureAsPdfIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Download Ticket as PDF
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" color="success.main" gutterBottom>
            PDF Downloaded Successfully!
          </Typography>
          <Typography variant="body1">
            Your ticket has been downloaded. Check your downloads folder.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleDownloadPDF}
            sx={{ mt: 2 }}
          >
            Download Again
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Download your ticket as a PDF file to print or save on your device.
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPDF}
            disabled={downloading}
            fullWidth
            sx={{ py: 1 }}
          >
            {downloading ? <CircularProgress size={24} /> : 'Download PDF Ticket'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default PDFTicketDownloader;