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
    const { name, label, ideology, user_id, logo } = req.body;

    if(await db.getParty(user_id)) {
        res.status(400).json({error: "User already has a party"});
        return;
    }

    await db.createParty(name, label, ideology, user_id, logo).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}