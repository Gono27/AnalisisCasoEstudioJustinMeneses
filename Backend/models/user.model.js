
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      nombre_completo: {
        type: Sequelize.STRING
      },
      usuario: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      contrasena: {
        type: Sequelize.STRING
      },
      es_administrador: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  
    return User;
  };
  