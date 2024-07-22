import React from 'react';
import { Container, Typography, Box, Paper, Avatar } from '@mui/material';

function Profile({ user }) {
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography component="h1" variant="h5">
                    {user.username}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body1"><strong>First Name:</strong> {user.firstName}</Typography>
                    <Typography variant="body1"><strong>Last Name:</strong> {user.lastName}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
                    <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Profile;
