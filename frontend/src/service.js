import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // URL base del backend
  timeout: 5000  // Tiempo máximo de espera para las peticiones en milisegundos
});

export default instance;
