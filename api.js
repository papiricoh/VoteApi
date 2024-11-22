const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const {router, setupWebSocketRoutes} = require('./api/routes');
const db = require('./api/database/databaseMain');


expressWs(app);


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const simpleAuth = async (req, res, next) => {
  if (req.path === '/api/v1/register' || req.path === '/api/v1/login' || req.path === '/api/v1/login/token') {
    return next();
  }
  

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [id, token] = credentials.split(':');

    try {
      const user = await db.getUserWithId(id);
      if (id == user.id && token == user.token) {
        //console.log('User authenticated: ', user.username);
        req.user = user;
        return next();
      }
    } catch (error) {
      return res.status(401).json({ message: 'Id does not exist' });
    }
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

app.use(simpleAuth);

defaultRoute = "/api/v1";

app.use(defaultRoute, router);

setupWebSocketRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server in port: ${port}`);
});

module.exports = app;