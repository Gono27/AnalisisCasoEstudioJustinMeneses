import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Home from './components/Home';
import Login from './components/Login';
import ClientList from './components/ClientList';
import AddClient from './components/AddClient';
import EditClient from './components/EditClient';
import Register from './components/Register';
import SalesList from './components/SalesList';
import AddSale from './components/AddSale';
import UserReport from './components/UserReport';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import TransactionOverview from './components/TransactionOverview';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import InvoiceForm from './components/InvoiceForm';
import { CartProvider } from './contexts/CartContext';
import './styles/styles.css';

function App() {
    const [user, setUser] = useState(null);

    return (
        <CartProvider>
            <Router>
                <Navbar user={user} setUser={setUser} />
                <Box sx={{ display: 'flex' }}>
                    {user && user.role === 'admin' && <Sidebar />}
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login setUser={setUser} />} />
                            <Route path="/clientes" element={<ClientList />} />
                            <Route path="/add-client" element={<AddClient />} />
                            <Route path="/edit-client/:id" element={<EditClient />} />
                            <Route path="/ventas" element={<SalesList />} />
                            <Route path="/add-sale" element={<AddSale />} />
                            <Route path="/reporte" element={<UserReport />} />
                            <Route path="/usuarios" element={<UserList />} />
                            <Route path="/edit-user/:id" element={<EditUser />} />
                            <Route path="/transactions/:clientId" element={<TransactionList />} />
                            <Route path="/add-transaction" element={<AddTransaction />} />
                            <Route path="/transactions" element={<TransactionOverview />} />
                            <Route path="/generate-general-report" element={<TransactionOverview />} />
                            <Route path="/generate-client-report/:clientId" element={<TransactionList />} />
                            <Route path="/product-detail/:productId" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/InvoiceForm" element={<InvoiceForm />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/profile" element={<Profile user={user} />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </CartProvider>
    );
}

export default App;
