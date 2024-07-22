// src/components/EditClient.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function EditClient() {
    const { id } = useParams(); // Aquí obtenemos los parámetros de la ruta
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [clientType, setClientType] = useState('individual');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/clients/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const client = response.data;
                setName(client.name);
                setAddress(client.address);
                setContactInfo(client.contact_info);
                setClientType(client.client_type);
            } catch (error) {
                setMessage('Error fetching client data');
                console.error('Error fetching client:', error);
            }
        };
        fetchClient();
    }, [id]);

    const handleEditClient = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/clients/${id}`, { name, address, contact_info: contactInfo, client_type: clientType }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Client updated successfully');
        } catch (error) {
            setMessage('Failed to update client');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Client
                </Typography>
                <form onSubmit={handleEditClient}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Contact Info"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Client Type"
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value)}
                            variant="outlined"
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                        </TextField>
                    </Box>
                    <Button variant="contained" color="primary" type="submit">
                        Update Client
                    </Button>
                </form>
                {message && <Typography color="error" variant="body2">{message}</Typography>}
            </Box>
        </Container>
    );
}

export default EditClient;
