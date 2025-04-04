import React, { useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';
import { 
    Card, 
    CardContent, 
    Typography, 
    Avatar, 
    Box, 
    Divider,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfileDetails = () => {
    const { user, logoutUser } = useContext(BookingContext);

    if (!user) {
        return (
            <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Typography variant="h6">
                    Please login to view your profile details.
                </Typography>
            </Paper>
        );
    }

    return (
        <Card elevation={3} sx={{ mb: 3, overflow: 'visible' }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            mr: 2, 
                            bgcolor: 'primary.main',
                            boxShadow: 2
                        }}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom color="primary">
                    Contact Information
                </Typography>
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                    <ListItem>
                        <ListItemText 
                            primary="Email" 
                            secondary={user.email} 
                            primaryTypographyProps={{ 
                                variant: 'subtitle2', 
                                color: 'text.secondary' 
                            }}
                            secondaryTypographyProps={{ 
                                variant: 'body1',
                                color: 'text.primary'
                            }}
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText 
                            primary="Phone" 
                            secondary={user.phone || 'Not provided'} 
                            primaryTypographyProps={{ 
                                variant: 'subtitle2', 
                                color: 'text.secondary' 
                            }}
                            secondaryTypographyProps={{ 
                                variant: 'body1',
                                color: 'text.primary'
                            }}
                        />
                    </ListItem>
                </List>

                <Box mt={3} display="flex" justifyContent="flex-start" gap={2}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        size="medium"
                        startIcon={<EditIcon />}
                    >
                        Edit Profile
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="medium"
                        startIcon={<LogoutIcon />}
                        onClick={logoutUser}
                    >
                        Logout
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfileDetails;