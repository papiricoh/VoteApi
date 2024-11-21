const db = require('../database/databaseGov');
const dbMain = require('../database/databaseMain');

const perms = {
    "admin": 10,
    "president": 4,
    "vice_president": 3,
    "minister": 2,
    "secretary": 1
}

exports.getGovernment = async (req, res) => {
    db.getGovernment().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.createGovernmentRole = async (req, res) => {
    const { user_id, target_id, role, perms } = req.body;

    const user = await dbMain.getUserWithId(user_id);
    if(user.role < perms["president"]) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    //TODO check if target user exists and not already in government
    const target = await dbMain.getUserWithId(target_id);
    if(!target) {
        res.status(404).json({error: "Target user not found"});
        return;
    }
    /*
    db.removeFromGovernment(target_id).then((result) => {
        console.log("Removed from government");
    }).catch((err) => {
        console.log("Error removing from government");
    });
    */

    db.createGovernmentRole(target_id, role).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}