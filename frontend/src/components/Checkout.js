// src/components/Checkout.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('tu_clave_publica_de_stripe');

function Checkout() {
    const { cartItems, clearCart } = useContext(CartContext);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const createPaymentIntent = async () => {
            const response = await axios.post('http://localhost:3001/create-payment-intent', {
                items: cartItems,
            });
            setClientSecret(response.data.clientSecret);
        };

        createPaymentIntent();
    }, [cartItems]);

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: name,
                    address: {
                        line1: address,
                    },
                },
            },
        });

        if (error) {
            console.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            alert('Compra realizada con éxito');
            clearCart();
        }
    };

    return (
        <Container maxWidth="md">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    Finalizar Compra
                </Typography>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Información de Envío
                            </Typography>
                            <TextField
                                fullWidth
                                label="Nombre Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Dirección"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                variant="outlined"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Información de Pago
                            </Typography>
                            <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
                        </Grid>
                    </Grid>
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Resumen del Pedido
                        </Typography>
                        {cartItems.map((item, index) => (
                            <Box key={index} display="flex" justifyContent="space-between" mb={2}>
                                <Box display="flex">
                                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '16px' }} />
                                    <Box>
                                        <Typography variant="body1">{item.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                                        <Typography variant="body2">Cantidad: {item.quantity}</Typography>
                                        <Typography variant="body2">Precio: ${item.price}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                            </Box>
                        ))}
                        <Typography variant="h6" align="right" mt={2}>
                            Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box mt={4} textAlign="center">
                        <Button variant="contained" color="primary" size="large" onClick={handleCheckout}>
                            Finalizar Compra
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

const WrappedCheckout = () => (
    <Elements stripe={stripePromise}>
        <Checkout />
    </Elements>
);

export default WrappedCheckout;
