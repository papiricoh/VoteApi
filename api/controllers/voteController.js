const e = require('express');
const db = require('../database/databaseVote');
const sessionManager = require('../app/sessionManager');


exports.test = async (req, res) => {
    res.status(200).json("OK");
};


exports.wellcome = async (req, res) => {
    await db.getGovernment().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}


exports.createParty = async (req, res) => {
    const { name, label, ideology, user_id, logo, color } = req.body;

    const party = await db.getParty(user_id);
    if(party != null && party.label != 'IND') {
        res.status(400).json({error: "User already has a party"});
        return;
    }
    
    await db.createParty(name, label, ideology, user_id, logo, color).then(async (result) => {

        
        await db.joinParty(user_id, result).then((result2) => {
            res.status(200).json(result2);
            return;
        }).catch((err) => {
            res.status(400).json({error: err});
            return;
        });
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getParty = async (req, res) => {
    const { user_id } = req.body;

    await db.getParty(user_id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getAllParties = async (req, res) => {
    await db.getAllParties().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.leaveParty = async (req, res) => {
    const { user_id } = req.body;
    const user = await db.getUser(user_id);
    const party = await db.getUserParty(user_id);
    const partyMembers = await db.getPartyMembers(party.id);

    
    
    if(party.label == 'IND') {
        res.status(400).json({error: "User is not in a party"});
        return;
    }

    await db.joinParty(user_id, 1).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });

    if(partyMembers.length <= 1) {
        await db.deleteParty(party.id).then((result) => {
            console.log("Party deleted: ", party.label);
            
        }).catch((err) => {
            console.log(err);
            
        });
    }
    //TODO: if leader asign new leader


    
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
            res.status(400).json({error: err});
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
            res.status(400).json({error: err});
        });
    } catch (error) {
        res.status(401).json({error: "User has no party"});
    }
}

exports.getAllLaws = async (req, res) => {  
    await db.getAllLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getAllPendingLaws = async (req, res) => {
    await db.getAllPendingLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getAllSignedLaws = async (req, res) => {
    await db.getAllSignedLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.signLaw = async (req, res) => {
    const { user_id, law_id } = req.body;
    const user = await db.getUser(user_id);
    const government = await db.getGovernment();
    var isPresident = false;
    for (let i = 0; i < government.length; i++) {
        if(government[i].user_id == user_id && government[i].id == 1) {
            isPresident = true;
        }
    }

    if(user.perms > 7 || isPresident) {
        await db.signLaw(law_id).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json({error: err});
        });
    }else {
        res.status(400).json({error: "User has no permissions"});
    }
}

exports.getAllPendingLaws = async (req, res) => {
    await db.getAllPendingLaws().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getLaw = async (req, res) => {
    const { id } = req.params;

    await db.getLaw(id).then( async (result) => {
        await db.getLawArticles(id).then(async (articles) => {
            result[0].articles = articles;
            
            res.status(200).json(result[0]);
        }).catch((err) => {
            res.status(400).json({error: err});
        });
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getAllRules = async (req, res) => {
    await db.getAllRules().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.newSession = async (req, res) => {
    const { user_id, type } = req.body;
    let target_id = req.body.target_id ?? null;
    let value = req.body.value ?? null;

    var title = "";
    if(type == "law") {
        const law = await db.getLaw(target_id);
        title = "Votacion para aprovar la " + law[0].title;
    }else if(type == "ruleChange") {
        const rule = await db.getRule(target_id);
        title = "Votacion para cambiar la regla constitucional " + rule[0].name + " a " + value;
    }else if(type == "control") {
        title = "Sesion de control";
    }

    await db.insertSession(user_id, type, target_id, value, title).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.getAllPendingSessions = async (req, res) => {
    await db.getPendingSessions().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json({error: err});
    });
}

exports.startSession = async (req, res) => {
    const { user_id, session_id } = req.body;

    const sessions = await db.getSession(session_id);
    if(sessions.length == 0) {
        res.status(400).json({error: "No existe la sesion"});
        return;
    }
    const session = sessions[0];

    const users = await db.getCountUsers();
    let seats = users.length;
    
    

    const user = await db.getUser(user_id);
    delete user.password;
    

    if(user.perms < 2) {
        res.status(400).json({error: "No tienes permisos para iniciar una votacion"});
        return;
    }

    await sessionManager.startSession(seats, session.type, session.target_id, session.value, session.title, users, session_id);


    res.status(200).json(await sessionManager.getSession());
}

exports.session = async (req, res) => {
    var response = {};
    
    response = await sessionManager.getSession();
    response.inSession = sessionManager.isInSession;
    
    res.status(200).json(response);
}