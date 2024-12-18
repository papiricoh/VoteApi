const bcrypt = require('bcrypt');
const saltRounds = 2;
const tokenSaltRounds = 6;
const db = require('../database/databaseMain');
const voteDb = require('../database/databaseVote');
const govDb = require('../database/databaseGov');

async function generateToken(username) {
    return await bcrypt.hashSync(username, tokenSaltRounds);
}

exports.test = async (req, res) => {
    res.status(200).json("OK");
};

exports.register = async (req, res) => {
    const data = req.body;
    
    if(data.username && data.password) {
        bcrypt.hash(data.password, saltRounds, async function(err, hash) {
            try {
                if (!data.email.endsWith("@myuax.com")) {
                    res.status(404).json({ error: "invalid email"});
                    return;
                }
                const result = await db.register(data.username, data.email ?? null, hash, await generateToken(data.username), data.first_name ?? "John", data.last_name ?? "Doe");
                await voteDb.addToParty(result, 1);
                
                res.status(200).json(result);

            } catch (error) {
                res.status(500).json({ error: "Register error " + error });
            }
        });
    }else {
        res.status(404).json({ error: "Missing fields"});
    }
    
};

exports.login = async (req, res) => {
    const data = req.body;
    
    if(data.username && data.password) {
        //bcrypt.hash(data.password, saltRounds, async function(err, hash) {
            try {
                const user = await db.getUserWithUsername(data.username);
                
                
                const pass = await bcrypt.compare(data.password, user.password)

                
                if(pass) {
                    delete user.password
                    user.token = await db.newToken(user.id, await generateToken(user.username));

                    user.party = await voteDb.getUserParty(user.id);
                    
                    user.government = await govDb.getGovernmentRole(user.id) ?? null;
                    user.isPartyLeader = user.party.leader == user.id;

                    res.status(200).json(user);
                }else {
                    res.status(404).json({ error: "invalid password"});
                }

            } catch (error) {
                res.status(500).json({ error: "Register error " + error });
            }
        //});
    }else {
        res.status(404).json({ error: "Missing fields"});
    }
    
};

exports.loginToken = async (req, res) => {
    const data = req.body;
    
    if(data.username && data.token) {
        //bcrypt.hash(data.password, saltRounds, async function(err, hash) {
            try {
                const user = await db.getUserWithUsername(data.username);
                
                
                const pass = data.token === user.token

                
                if(pass) {
                    delete user.password

                    user.party = await voteDb.getUserParty(user.id);
                    user.government = await govDb.getGovernmentRole(user.id) ?? null;
                    user.isPartyLeader = user.party.leader == user.id;

                    res.status(200).json(user);
                }else {
                    res.status(404).json({ error: "invalid password"});
                }

            } catch (error) {
                res.status(500).json({ error: "Register error " + error });
            }
        //});
    }else {
        res.status(404).json({ error: "Missing fields"});
    }
    
};
