import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, History as HistoryIcon, Add as AddIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function ClientList() {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/clients')
            .then(response => setClients(response.data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/clients/${id}`);
            setClients(clients.filter(client => client.client_id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Clientes
                </Typography>
                <IconButton component={Link} to="/add-client" color="primary" style={{ marginBottom: '20px' }}>
                    <AddIcon />
                </IconButton>
                <Box display="flex" flexWrap="wrap">
                    {clients.map((client) => (
                        <Card key={client.client_id} className="card">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {client.name}
                                </Typography>
                                <Typography color="textSecondary">
                                    {client.address}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {client.contact_info}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {client.client_type}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton component={Link} to={`/edit-client/${client.client_id}`} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(client.client_id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/transactions/${client.client_id}`)} color="default">
                                    <HistoryIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={() => navigate(`/add-transaction/${client.client_id}`)}>
                                    <AddIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default ClientList;
