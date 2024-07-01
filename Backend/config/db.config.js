
module.exports = {
    HOST: "localhost",
    USER: "root",        
    PASSWORD: " ",    
    DB: "Impresiones Avila",         // Nombre de la base de datos
    dialect: "mysql",
    pool: {
      max: 5,            // Número máximo de conexiones en el grupo de conexiones
      min: 0,            // Número mínimo de conexiones en el grupo de conexiones
      acquire: 30000,    // Tiempo máximo, en milisegundos, que una solicitud de conexión puede esperar para adquirir una conexión
      idle: 10000        // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva antes de ser devuelta al grupo de conexiones
    }
  };
  