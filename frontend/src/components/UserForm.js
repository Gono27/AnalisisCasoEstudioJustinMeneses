
import React, { useState } from 'react';
import axios from '../service';

const UserForm = () => {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    usuario: '',
    correo: '',
    contrasena: '',
    es_administrador: false
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData);
      alert('Usuario creado correctamente.');
      setFormData({
        nombre_completo: '',
        usuario: '',
        correo: '',
        contrasena: '',
        es_administrador: false
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear usuario. Verifica la consola para más detalles.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nombre_completo" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={handleChange} required />
      <input
