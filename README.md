Para el backend
Paso 1: Configuración del Proyecto
1.Crear un directorio para el proyecto y configurar Node.js:

mkdir backend
cd backend
npm init -y

2.Instalar las dependencias necesarias:

bash
Copy code
npm install express mysql body-parser cors

Para el frontend:

1.Crear un nuevo directorio para el frontend:

bash

Copy code
mkdir frontend
cd frontend
npx create-react-app .

2.Instalar Axios para hacer peticiones HTTP desde React:

bash

Copy code
npm install axios

3.Ejecutar la Aplicación

Ejecuta el servidor backend:

bash

Copy code
node index.js

Ejecuta la aplicación React:

bash

Copy code
npm start
