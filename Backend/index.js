
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

const db = require("./models");
db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
require("./routes/user.routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}.`);
});
