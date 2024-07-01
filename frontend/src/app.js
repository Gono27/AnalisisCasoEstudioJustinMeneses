import React from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import axios from './service';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Impresiones Avila</h1>
      </header>
      <div className="App-content">
        <UserList />
        <UserForm />
      </div>
    </div>
  );
};

export default App;
