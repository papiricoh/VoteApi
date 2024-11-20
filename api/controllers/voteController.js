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