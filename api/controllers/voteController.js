const e = require('express');
const db = require('../database/databaseVote');



exports.test = async (req, res) => {
    res.status(200).json("OK");
};


exports.wellcome = async (req, res) => {
    await db.getGovernment().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}


exports.createParty = async (req, res) => {
    const { name, label, ideology, user_id, logo, color } = req.body;

    if(await db.getParty(user_id)) {
        res.status(400).json({error: "User already has a party"});
        return;
    }

    await db.createParty(name, label, ideology, user_id, logo, color).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getParty = async (req, res) => {
    const { user_id } = req.body;

    await db.getParty(user_id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getAllParties = async (req, res) => {
    await db.getAllParties().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.leaveParty = async (req, res) => {
    const { user_id } = req.body;
    const user = req.user;
    if(user.id == user_id || user.perms > 2) {
        const party = await db.getParty(user_id);
        if(party.leader == user_id) {
            res.status(400).json({error: "Cannot leave party as leader"});
            return;
        }
        await db.leaveParty(user_id).then(async (result) => {

            await db.joinParty(user_id, 1).then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                res.status(400).json(err);
            });
        }).catch((err) => {
            res.status(400).json(err);
        });
    }

}

exports.transferPartyLeader = async (req, res) => {
    const { user_id, target_id } = req.body;
    const user = req.user;
    if(user.id == user_id || user.perms > 8) {
        const party = await db.getParty(user_id);
        if(party.leader != user_id) {
            res.status(400).json({error: "User is not party leader"});
            return;
        }
        await db.changePartyLeader(target_id, party.id).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    }
}

exports.createLaw = async (req, res) => {
    const { name, description, user_id, articles } = req.body;


    try {
        const party = await db.getParty(user_id);
        
    
        await db.createLaw(name, description, party.id, user_id, articles).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    } catch (error) {
        res.status(401).json({error: "User has no party"});
    }
}

exports.getAllLaws = async (req, res) => {  
    await db.getAllLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getAllPendingLaws = async (req, res) => {
    await db.getAllPendingLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getAllSignedLaws = async (req, res) => {
    await db.getAllSignedLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getAllPendingLaws = async (req, res) => {
    await db.getAllPendingLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.getLaw = async (req, res) => {
    const { id } = req.params;

    await db.getLaw(id).then( async (result) => {
        await db.getLawArticles(id).then(async (articles) => {
            result[0].articles = articles;
            
            res.status(200).json(result[0]);
        }).catch((err) => {
            res.status(400).json(err);
        });
    }).catch((err) => {
        res.status(400).json(err);
    });
}