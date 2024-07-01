
import React, { useState, useEffect } from 'react';
import axios from '../service';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.nombre_completo}</strong> ({user.usuario}) - {user.correo}
            {user.es_administrador && <span> - Administrador</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
