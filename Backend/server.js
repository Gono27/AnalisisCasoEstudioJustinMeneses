const express = require('express');
const mysql = require('mysql2');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Stripe = require('stripe');
const multer = require('multer');
const bodyParser = require('body-parser');
const axios = require('axios');// facturacion
const xmlbuilder = require('xmlbuilder');
const forge = require('node-forge');

const app = express();
const stripe = Stripe('tu_clave_secreta_de_stripe'); // Asegúrate de usar tu clave secreta de Stripe
const SECRET_KEY = 'amovertele'; // Clave secreta segura
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'amovertele',  
    database: 'ImpresionesAvila'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Database connected');
});


app.post('/register', upload.single('profileImage'), async (req, res) => {
    const { username, firstName, lastName, email, birthDate, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO Users (username, first_name, last_name, email, birth_date, password, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [username, firstName, lastName, email, birthDate, hashedPassword, profileImage];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
                return;
            }

            res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    }
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({ success: true, token, user: { username: user.username, role: user.role } });
    });
});

// CRUD de clientes
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM Clients', (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(200).send(results);
    });
});

// Obtener cliente por ID
app.get('/clients/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Clients WHERE client_id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(404).send('Client not found');
        res.status(200).send(results[0]);
    });
});


app.post('/clients', (req, res) => {
    const { user_id, name, address, contact_info, client_type } = req.body;

    db.query('INSERT INTO Clients (user_id, name, address, contact_info, client_type) VALUES (?, ?, ?, ?, ?)', [user_id, name, address, contact_info, client_type], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('Client added');
    });
});

app.put('/clients/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, contact_info, client_type } = req.body;

    db.query('UPDATE Clients SET name = ?, address = ?, contact_info = ?, client_type = ? WHERE client_id = ?', [name, address, contact_info, client_type, id], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(200).send('Client updated');
    });
});

app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Clients WHERE client_id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(200).send('Client deleted');
    });
});

app.post('/sales', (req, res) => {
    const { sale_date, total_amount, items } = req.body;

    db.query('INSERT INTO Sales (sale_date, total_amount) VALUES (?, ?)', [sale_date, total_amount], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        const sale_id = results.insertId;

        const saleItems = items.map(item => [sale_id, item.description, item.quantity, item.unit_price]);

        db.query('INSERT INTO SaleItems (sale_id, description, quantity, unit_price) VALUES ?', [saleItems], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }
            res.status(201).send('Sale added');
        });
    });
});

// Ruta para obtener todas las ventas
app.get('/sales', (req, res) => {
    db.query('SELECT * FROM Sales', (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(200).send(results);
    });
});



// Ruta para obtener los datos de los usuarios
app.get('/users', (req, res) => {
    const query = 'SELECT user_id, username, email, created_at, role FROM Users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Ruta para generar el informe de usuarios en PDF
app.get('/generate-user-report', (req, res) => {
    const query = 'SELECT user_id, username, email, created_at, role FROM Users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }

        // Crear un documento PDF
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, 'user_report.pdf');
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Añadir el título del informe
        doc.fontSize(18).text('Informe de Usuarios', { align: 'center' });
        doc.moveDown();

        // Añadir la tabla de usuarios
        const tableTop = 100;
        const itemHeight = 20;

        doc.fontSize(12);
        doc.text('ID', 50, tableTop);
        doc.text('Nombre de usuario', 100, tableTop);
        doc.text('Email', 200, tableTop);
        doc.text('Fecha de creación', 300, tableTop);
        doc.text('Rol', 400, tableTop);

        results.forEach((user, i) => {
            const y = tableTop + (i + 1) * itemHeight;
            doc.text(user.user_id, 50, y);
            doc.text(user.username, 100, y);
            doc.text(user.email, 200, y);
            doc.text(user.created_at, 300, y);
            doc.text(user.role, 400, y);
        });

        // Finalizar el documento
        doc.end();

        stream.on('finish', () => {
            res.download(filePath, 'user_report.pdf', (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Server error');
                } else {
                    // Eliminar el archivo después de la descarga
                    fs.unlinkSync(filePath);
                }
            });
        });
    });
});

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    const query = 'SELECT user_id, username, email, created_at, role FROM Users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Ruta para obtener un usuario por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT user_id, username, email, created_at, role FROM Users WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        res.json(results[0]);
    });
});

// Ruta para actualizar un usuario
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const query = 'UPDATE Users SET username = ?, email = ?, role = ? WHERE user_id = ?';
    db.query(query, [username, email, role, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).send('Server error');
        }
        res.send('User updated');
    });
});

// Ruta para eliminar un usuario
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Users WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).send('Server error');
        }
        res.send('User deleted');
    });
});

// Ruta para obtener todas las transacciones
app.get('/transactions', (req, res) => {
    const query = `
        SELECT t.*, c.pending_balance 
        FROM Transactions t
        JOIN Clients c ON t.client_id = c.client_id`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Ruta para obtener todas las transacciones de un cliente
app.get('/transactions/:clientId', (req, res) => {
    const { clientId } = req.params;
    const query = 'SELECT * FROM Transactions WHERE client_id = ?';
    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Ruta para crear una nueva transacción
app.post('/transactions', (req, res) => {
    const { client_id, order_date, item_description, quantity, unit_price } = req.body;
    const total_price = quantity * unit_price;
    const query = 'INSERT INTO Transactions (client_id, order_date, item_description, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [client_id, order_date, item_description, quantity, unit_price, total_price], (err, results) => {
        if (err) {
            console.error('Error al insertar transacción:', err);
            return res.status(500).send('Server error');
        }
        res.status(201).send('Transaction created');
    });
});

// Ruta para generar el informe general
app.get('/generate-general-report', (req, res) => {
    const query = `
        SELECT t.*, c.name AS client_name, c.pending_balance 
        FROM Transactions t
        JOIN Clients c ON t.client_id = c.client_id`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        // Generar el PDF usando los resultados
        const html = `
            <h1>Informe General de Transacciones</h1>
            <table border="1">
                <tr>
                    <th>ID Transacción</th>
                    <th>ID Cliente</th>
                    <th>Nombre del Cliente</th>
                    <th>Fecha del Pedido</th>
                    <th>Descripción del Artículo</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Precio Total</th>
                    <th>Saldo Pendiente</th>
                </tr>
                ${results.map(transaction => `
                <tr>
                    <td>${transaction.transaction_id}</td>
                    <td>${transaction.client_id}</td>
                    <td>${transaction.client_name}</td>
                    <td>${transaction.order_date}</td>
                    <td>${transaction.item_description}</td>
                    <td>${transaction.quantity}</td>
                    <td>${transaction.unit_price}</td>
                    <td>${transaction.total_price}</td>
                    <td>${transaction.pending_balance}</td>
                </tr>`).join('')}
            </table>
        `;
        pdf.create(html).toStream((err, stream) => {
            if (err) {
                return res.status(500).send('Error generating PDF');
            }
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    });
});

// Ruta para generar el informe de transacciones de un cliente
app.get('/generate-client-report/:clientId', (req, res) => {
    const { clientId } = req.params;
    const query = `
        SELECT t.*, c.name AS client_name, c.pending_balance 
        FROM Transactions t
        JOIN Clients c ON t.client_id = c.client_id
        WHERE t.client_id = ?`;
    db.query(query, [clientId], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Server error');
        }
        // Generar el PDF usando los resultados
        const html = `
            <h1>Informe de Transacciones del Cliente ${results[0].client_name}</h1>
            <table border="1">
                <tr>
                    <th>ID Transacción</th>
                    <th>ID Cliente</th>
                    <th>Fecha del Pedido</th>
                    <th>Descripción del Artículo</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Precio Total</th>
                    <th>Saldo Pendiente</th>
                </tr>
                ${results.map(transaction => `
                <tr>
                    <td>${transaction.transaction_id}</td>
                    <td>${transaction.client_id}</td>
                    <td>${transaction.order_date}</td>
                    <td>${transaction.item_description}</td>
                    <td>${transaction.quantity}</td>
                    <td>${transaction.unit_price}</td>
                    <td>${transaction.total_price}</td>
                    <td>${transaction.pending_balance}</td>
                </tr>`).join('')}
            </table>
        `;
        pdf.create(html).toStream((err, stream) => {
            if (err) {
                return res.status(500).send('Error generating PDF');
            }
            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        });
    });
});

// Obtener todos los productos
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM Products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Obtener un producto por ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM PriceList WHERE price_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            return res.status(500).send('Error del servidor');
        }
        if (results.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.json(results[0]);
    });
});

app.post('/create-payment-intent', async (req, res) => {
    const { items } = req.body;

    // Calcula el total del precio
    const calculateOrderAmount = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Stripe usa centavos
    };

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(3001, () => {
    console.log('Server is running on port 3000');
});

//facturacion 

const app = express();
app.use(bodyParser.json());

// Función para obtener el token de autenticación
const obtenerToken = async () => {
  const data = {
    client_id: 'tu_cliente_id',
    client_secret: 'tu_cliente_secret',
    grant_type: 'password',
    username: 'tu_usuario',
    password: 'tu_contrasena'
  };

  try {
    const response = await axios.post('https://idp.comprobanteselectronicos.go.cr/auth/realms/rut/protocol/openid-connect/token', new URLSearchParams(data));
    return response.data.access_token;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    throw error;
  }
};

// Función para generar el XML de la factura
const generarXMLFactura = (datosFactura) => {
  const xml = xmlbuilder.create('FacturaElectronica', { encoding: 'utf-8' })
    .att('xmlns', 'https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.3/facturaElectronica')
    .ele('Clave', datosFactura.clave).up()
    .ele('NumeroConsecutivo', datosFactura.numeroConsecutivo).up()
    .ele('FechaEmision', datosFactura.fechaEmision).up()
    // Aquí agregas los nodos y elementos necesarios para el XML
    // ...continúa agregando otros elementos
    .end({ pretty: true });

  return xml;
};

// Función para firmar el XML
const firmarXML = (xml, p12Buffer, password) => {
  const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
  const keyObj = p12.getBags({ friendlyName: 'nombre_certificado' }).friendlyName[0];
  const privateKey = keyObj.key;
  const certificate = p12.getBags({ friendlyName: 'nombre_certificado' }).friendlyName[0].cert;

  // Aquí agregas la lógica para firmar el XML usando `node-forge`
  // Nota: la firma digital de XML puede ser compleja y puede requerir una biblioteca específica para XML DSig

  return xmlFirmado;
};

// Función para enviar la factura
const enviarFactura = async (xmlFirmado, token) => {
  const data = {
    clave: 'clave_unica',
    fecha: new Date().toISOString(),
    emisor: { /* datos del emisor */ },
    receptor: { /* datos del receptor */ },
    comprobanteXml: xmlFirmado
  };

  try {
    const response = await axios.post('https://api.comprobanteselectronicos.go.cr/recepcion/v1/comprobantes', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error enviando factura:', error);
    throw error;
  }
};

// Endpoint para generar y enviar la factura
app.post('/api/generate-invoice', async (req, res) => {
  const { cliente, productos } = req.body;

  const datosFactura = {
    clave: 'clave_unica', // Genera o asigna la clave única
    numeroConsecutivo: 'numero_consecutivo',
    fechaEmision: new Date().toISOString(),
    cliente,
    productos,
    // Otros detalles necesarios para la factura
  };

  try {
    const token = await obtenerToken();
    const xml = generarXMLFactura(datosFactura);
    const p12Buffer = fs.readFileSync('ruta/al/certificado.p12');
    const xmlFirmado = firmarXML(xml, p12Buffer, 'contrasena_certificado');
    const respuesta = await enviarFactura(xmlFirmado, token);
    res.json(respuesta);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  