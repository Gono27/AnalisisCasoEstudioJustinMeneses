// src/components/ProductDetail.js
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import axios from 'axios';

function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/products/${productId}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product:', error));
    }, [productId]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: parseInt(quantity) });
    };

    if (!product) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md">
            <Box mt={5} className="product-details">
                <img src={product.image} alt={product.name} className="product-image" />
                <Typography variant="h4" component="h1" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="h6" component="h2">
                    ${product.price}
                </Typography>
                <Typography variant="body1" component="p">
                    {product.description}
                </Typography>
                <TextField
                    label="Cantidad"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    variant="outlined"
                    style={{ marginTop: '20px' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddToCart} style={{ marginTop: '20px' }}>
                    Añadir al Carrito
                </Button>
            </Box>
        </Container>
    );
}

export default ProductDetail;
