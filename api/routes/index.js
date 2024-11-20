const express = require('express');
const router = express.Router();
const mainController = require("../controllers/mainController")
const voteController = require("../controllers/voteController")
const websocketCotroller = require("../controllers/websocketController");

/*
#############################################################
CORE ROUTES
#############################################################
*/
router.get('/', mainController.test)


router.post('/register', mainController.register)
router.post('/login', mainController.login)
router.post('/login/token', mainController.loginToken)
router.post('/test', mainController.test)


/*
#############################################################
MAIN ROUTES
#############################################################
*/
//router.post('/club', clubController.getClub)
router.post('/wellcome', voteController.wellcome)
router.post('/parties/create', voteController.createParty)


/*
#############################################
###############   WEBSOCKETS  ###############
#############################################
*/
function setupWebSocketRoutes(app) {
    app.ws(defaultRoute + '/web', websocketCotroller.mainWS);
    
}

module.exports = {router, setupWebSocketRoutes};