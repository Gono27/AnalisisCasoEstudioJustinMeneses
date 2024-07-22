// src/components/SalesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function SalesList() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/sales')
            .then(response => setSales(response.data))
            .catch(error => console.error('Error fetching sales:', error));
    }, []);

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ventas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/add-sale"
                    style={{ marginBottom: '20px' }}
                >
                    Agregar Venta
                </Button>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Monto Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.map((sale) => (
                                <TableRow key={sale.sale_id}>
                                    <TableCell>{sale.sale_id}</TableCell>
                                    <TableCell>{sale.sale_date}</TableCell>
                                    <TableCell>{sale.total_amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default SalesList;
