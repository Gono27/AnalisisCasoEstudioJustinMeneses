import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/users/${id}`)
            .then(response => {
                const user = response.data;
                setUsername(user.username);
                setEmail(user.email);
                setRole(user.role);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, [id]);

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/users/${id}`, { username, email, role });
            setMessage('User updated successfully');
            navigate('/usuarios');
        } catch (error) {
            setMessage('Failed to update user');
            console.error('Error updating user:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Editar Usuario
                </Typography>
                <form onSubmit={handleEditUser}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Rol"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Button variant="contained" color="primary" type="submit">
                        Actualizar Usuario
                    </Button>
                </form>
                {message && <Typography color={message.includes('successfully') ? 'primary' : 'error'} variant="body2">{message}</Typography>}
            </Box>
        </Container>
    );
}

export default EditUser;
