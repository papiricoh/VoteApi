//const db = require('../database/databaseGame');

const clients = new Set();

exports.mainWS = async (ws, req) => {

  console.log('Cliente conectado');
  clients.add(ws);
  ws.send(JSON.stringify('Bienvenido al servidor WebSocket'));

  ws.on('message', async (msg) => {
    msg = JSON.parse(msg);
    console.log(`Mensaje recibido: ${msg}`);
    if(msg.type === 'ping') {
      ws.send(JSON.stringify('pong'));
      return;
    }

    ws.send(JSON.stringify(msg))
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('Error en la conexión WebSocket:', err);
  });
}

const broadcast = (message) => {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

exports.clients = clients;
exports.broadcast = broadcast;