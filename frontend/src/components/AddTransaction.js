import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function AddTransaction() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [order_date, setOrderDate] = useState('');
    const [item_description, setItemDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/transactions', { client_id: clientId, order_date, item_description, quantity, unit_price });
            setMessage('Transaction added successfully');
            setOrderDate('');
            setItemDescription('');
            setQuantity('');
            setUnitPrice('');
            navigate(`/transactions/${clientId}`);
        } catch (error) {
            setMessage('Failed to add transaction');
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Agregar Transacción para Cliente ID: {clientId}
                </Typography>
                <form onSubmit={handleAddTransaction}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Fecha del Pedido"
                            type="date"
                            value={order_date}
                            onChange={(e) => setOrderDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Descripción del Artículo"
                            value={item_description}
                            onChange={(e) => setItemDescription(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Cantidad"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Precio Unitario"
                            value={unit_price}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Button variant="contained" color="primary" type="submit">
                        Agregar Transacción
                    </Button>
                </form>
                {message && <Typography color={message.includes('successfully') ? 'primary' : 'error'} variant="body2">{message}</Typography>}
            </Box>
        </Container>
    );
}

export default AddTransaction;
