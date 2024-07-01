
const db = require("../models");
const User = db.users;

// Obtener todos los usuarios
exports.findAll = (req, res) => {
  User.findAll()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al obtener usuarios."
      });
    });
};

// Crear un nuevo usuario
exports.create = (req, res) => {
  // Validar la solicitud
  if (!req.body.nombre_completo || !req.body.usuario || !req.body.correo || !req.body.contrasena) {
    res.status(400).send({
      message: "Los campos no pueden estar vacíos."
    });
    return;
  }

  // Crear un usuario
  const user = {
    nombre_completo: req.body.nombre_completo,
    usuario: req.body.usuario,
    correo: req.body.correo,
    contrasena: req.body.contrasena,
    es_administrador: req.body.es_administrador ? req.body.es_administrador : false
  };

  // Guardar el usuario en la base de datos
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error al crear usuario."
      });
    });
};

// Actualizar un usuario por ID
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Usuario actualizado correctamente."
        });
      } else {
        res.send({
          message: `No se pudo actualizar el usuario con ID=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al actualizar el usuario con ID=" + id
      });
    });
};

// Eliminar un usuario por ID
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Usuario eliminado correctamente."
        });
      } else {
        res.send({
          message: `No se pudo eliminar el usuario con ID=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al eliminar el usuario con ID=" + id
      });
    });
};
