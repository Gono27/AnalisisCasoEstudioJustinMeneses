// src/components/AddSale.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function AddSale() {
    const [saleDate, setSaleDate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: 0, unit_price: 0 }]);
    const [message, setMessage] = useState('');

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/sales', { sale_date: saleDate, total_amount: totalAmount, items }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Sale added successfully');
        } catch (error) {
            setMessage('Failed to add sale');
            console.error('Error adding sale:', error);
        }
    };

    const handleItemChange = (index, event) => {
        const newItems = items.map((item, i) => {
            if (i !== index) return item;
            return { ...item, [event.target.name]: event.target.value };
        });
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 0, unit_price: 0 }]);
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add Sale
                </Typography>
                <form onSubmit={handleAddSale}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Sale Date"
                            type="date"
                            value={saleDate}
                            onChange={(e) => setSaleDate(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Total Amount"
                            type="number"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Items
                    </Typography>
                    {items.map((item, index) => (
                        <Box mb={2} key={index}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                                style={{ marginBottom: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                                style={{ marginBottom: '10px' }}
                            />
                            <TextField
                                fullWidth
                                label="Unit Price"
                                name="unit_price"
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                            />
                        </Box>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddItem}>
                        Add Item
                    </Button>
                    <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px' }}>
                        Add Sale
                    </Button>
                </form>
                {message && <Typography color="error" variant="body2">{message}</Typography>}
            </Box>
        </Container>
    );
}

export default AddSale;
