// src/components/Cart.js
import React, { useContext } from 'react';
import { Container, Typography, Box, Grid, Button, Paper, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

function Cart() {
    const { cartItems, removeFromCart } = useContext(CartContext);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    Tu Carrito
                </Typography>
                <Grid container spacing={3}>
                    {cartItems.map((item, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper elevation={3} style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '16px' }} />
                                <Box flexGrow={1}>
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                                    <Typography variant="body2">Cantidad: {item.quantity}</Typography>
                                    <Typography variant="body2">Precio: ${item.price}</Typography>
                                </Box>
                                <IconButton onClick={() => removeFromCart(index)}>
                                    <Delete />
                                </IconButton>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Total: ${calculateTotal()}</Typography>
                    <Button variant="contained" color="primary" size="large" component={Link} to="/checkout">
                        Finalizar Compra
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Cart;
