const express = require('express');
const router = express.Router();
const mainController = require("../controllers/mainController")
const voteController = require("../controllers/voteController")
const websocketCotroller = require("../controllers/websocketController");
const govController = require("../controllers/govController");
const newsController = require("../controllers/newsController");

/*
#############################################################
######################## CORE ROUTES ########################
#############################################################
*/
router.get('/', mainController.test)


router.post('/register', mainController.register)
router.post('/login', mainController.login)
router.post('/login/token', mainController.loginToken)
router.post('/test', mainController.test)


/*
#############################################################
######################## MAIN ROUTES ########################
#############################################################
*/
router.post('/wellcome', voteController.wellcome)
router.post('/parties', voteController.getAllParties)
router.post('/parties/create', voteController.createParty)
router.post('/parties/self', voteController.getParty)
router.post('/parties/leave', voteController.leaveParty)
router.post('/parties/transfer', voteController.transferPartyLeader)

router.post('/laws/new', voteController.createLaw)
router.post('/laws', voteController.getAllLaws)
router.post('/laws/signed', voteController.getAllSignedLaws)
router.post('/laws/sign', voteController.signLaw)
router.post('/laws/pending', voteController.getAllPendingLaws)
router.get('/laws/:id', voteController.getLaw)

/*
#############################################
###############   GOVERNMENT  ###############
#############################################
*/
router.post('/government', govController.getGovernment)
router.post('/government/new_role', govController.createGovernmentRole)
router.post('/government/self', govController.getSelfRole)
router.post('/government/alter_role', govController.alterGovernmentRole)


/*
#############################################
##############   VOTE SESSION  ##############
#############################################
*/

router.post('/rules', voteController.getAllRules)

router.post('/session', voteController.session)
router.post('/session/pending', voteController.getAllPendingSessions)
router.post('/session/new', voteController.newSession)
router.post('/session/start', voteController.startSession)



/*
#############################################
##############   VOTE SESSION  ##############
#############################################
*/
router.post('/news', newsController.getAllNews)
router.post('/news/:id', newsController.getNew)
router.post('/news/create', newsController.createNews)



/*
#############################################
###############   WEBSOCKETS  ###############
#############################################
*/
function setupWebSocketRoutes(app) {
    app.ws(defaultRoute + '/web', websocketCotroller.mainWS);
}

module.exports = {router, setupWebSocketRoutes};