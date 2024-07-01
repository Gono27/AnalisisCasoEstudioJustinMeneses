
module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Obtener todos los usuarios
    router.get("/", users.findAll);
  
    // Crear un nuevo usuario
    router.post("/", users.create);
  
    // Actualizar un usuario por ID
    router.put("/:id", users.update);
  
    // Eliminar un usuario por ID
    router.delete("/:id", users.delete);
  
    app.use("/api/users", router);
  };
  