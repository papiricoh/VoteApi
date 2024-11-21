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

    //check if target user exists and not already in government
    const target = await dbMain.getUserWithId(target_id);
    if(!target) {
        res.status(404).json({error: "Target user not found"});
        return;
    }

    if(!await db.getGovernmentRole(target_id)) {
        await db.createGovernmentRole(target_id, role).then((result) => {
            res.status(200).json(result);
            return;
        }).catch((err) => {
            res.status(400).json(err);
            return;
        });
        return;
    }else {
        await db.alterFromGovernment(target_id, role).then( async (result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log("Error removing from government");
            res.status(400).json(err);
        });
        return;
    }
    
}