// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, People, Receipt, Person, ListAlt, AccountBalanceWallet } from '@mui/icons-material'; // Asegúrate de importar AccountBalanceWallet

const drawerWidth = 240;

const Sidebar = () => {
    return (
        <div style={{ display: 'flex' }}>
            
            <Drawer
                variant="permanent"
                style={{
                    width: drawerWidth,
                    flexShrink: 0
                }}
            >
                <Toolbar />
                <div style={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem button component={Link} to="/clientes">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Clientes" />
                        </ListItem>
                        <ListItem button component={Link} to="/ventas">
                            <ListItemIcon><Receipt /></ListItemIcon>
                            <ListItemText primary="Ventas" />
                        </ListItem>
                        <ListItem button component={Link} to="/usuarios">
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Usuarios" />
                        </ListItem>
                        <ListItem button component={Link} to="/reporte">
                            <ListItemIcon><ListAlt /></ListItemIcon>
                            <ListItemText primary="Reporte" />
                        </ListItem>
                        <ListItem button component={Link} to="/transactions">
                            <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
                            <ListItemText primary="Transacciones" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default Sidebar;

