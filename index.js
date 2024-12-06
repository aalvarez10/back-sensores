const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto según el origen de tu app
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'] // Encabezados permitidos
  }));
  
// Middleware para parsear JSON
app.use(bodyParser.json());

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });

// Manejo de conexiones WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado vía WebSocket');
});

// Ruta para recibir datos desde ESP32
app.post('/api/sensores', (req, res) => {
    const sensorData = req.body;

    console.log('Datos recibidos del ESP32:', sensorData);

    // Enviar datos a todos los clientes WebSocket conectados
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(sensorData));
        }
    });

    res.status(200).send('Datos recibidos correctamente');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
