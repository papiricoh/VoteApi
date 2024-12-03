const db = require('../database/databaseNews');


exports.getAllNews = async (req, res) => {
    db.getAllNews().then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

exports.createNews = async (req, res) => {
    const data = req.body;
    if(data.title && data.subtitle && data.content && data.author && data.type) {
        db.insertNew(data.title, data.subtitle, data.content, data.author, data.type).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
    }else {
        res.status(404).json({ error: "Missing fields"});
    }
}