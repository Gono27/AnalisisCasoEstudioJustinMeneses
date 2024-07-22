import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Grid, Button, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Home() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    return (
        <Container maxWidth="lg">
            <Box mt={5} className="banner">
                <Typography variant="h3" gutterBottom>
                    ¡Bienvenido a Impresiones Avila!
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Ofrecemos una amplia variedad de impresiones de alta calidad.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                    Explorar Productos
                </Button>
            </Box>
            <Grid container spacing={4} className="home-grid">
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Impresión a Color"
                            height="140"
                            image="/images/color_print.jpeg"
                            title="Impresión a Color"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Impresión a Color
                            </Typography>
                            <Button variant="contained" color="primary" component={Link} to="/product-detail/1">
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Repite para más categorías */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Impresión en Blanco y Negro"
                            height="140"
                            image="/images/black_white_print.jpg"
                            title="Impresión en Blanco y Negro"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Impresión en Blanco y Negro
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/product-detail/2`}
                            >
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Tarjetas de Visita"
                            height="140"
                            image="/images/business_cards.jpg"
                            title="Tarjetas de Visita"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Tarjetas de Visita
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/product-detail/3`}
                            >
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Posters"
                            height="140"
                            image="/images/posters.jpg"
                            title="Posters"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Posters
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/product-detail/4`}
                            >
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Flyers"
                            height="140"
                            image="/images/flyers.jpg"
                            title="Flyers"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Flyers
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/product-detail/5`}
                            >
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="home-card">
                        <CardMedia
                            component="img"
                            alt="Brochures"
                            height="140"
                            image="/images/brochures.jpg"
                            title="Brochures"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Brochures
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to={`/product-detail/6`}
                            >
                                Ver Más
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;
