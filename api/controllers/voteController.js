const db = require('../database/databaseVote');



exports.test = async (req, res) => {
    res.status(200).json("OK");
};


exports.wellcome = async (req, res) => {
    db.getGovernment().then((result) => {
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