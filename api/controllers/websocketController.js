//const db = require('../database/databaseGame');


exports.mainWS = async (ws, req) => {

    ws.on('connection', async () => {
      console.log('Cliente conectado');
    });
  
    ws.on('message', async (msg) => {
      console.log(`Mensaje recibido: ${msg}`);

        ws.send(JSON.stringify(msg))
    });
  
    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
  
    ws.on('error', (err) => {
      console.error('Error en la conexión WebSocket:', err);
    });
  }
