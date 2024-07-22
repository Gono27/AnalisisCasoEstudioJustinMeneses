// src/components/CartButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

function CartButton({ cartItemCount }) {
    return (
        <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
            </Badge>
        </IconButton>
    );
}

export default CartButton;
