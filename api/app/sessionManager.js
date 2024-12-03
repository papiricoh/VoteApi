const Queue = require('./utils/Queue');
const dbVote = require('../database/databaseVote');
const db = require('../database/databaseVote');
const { broadcast } = require('../controllers/websocketController');

const sessionMinutes = 1;

class SessionManager {
    constructor() {
        if (!SessionManager.instance) {
            this.users = new Map();
            this.isInSession = false;
            this.seats = 0;
            this.type = "none";
            this.law = null;
            this.rule = null;
            this.ruleValue = null;
            this.startDate = null;
            this.endDate = null;
            this.session_id = null;
            SessionManager.instance = this;
            console.log("SessionManager created");
            
            this.queue = new Queue();
            this.init();
        }

        return SessionManager.instance;
    }

    async init() {
        let sessions = await dbVote.getPendingSessions();
        for(let session of sessions) {
            this.queue.enqueue(session);
        }
        
    }

    async startSession(seats, type, target_id, value, title, users, session_id) {
        this.users.clear();
        this.seats = seats;
        this.type = type;
        this.title = title;
        this.session_id = session_id;
        this.forVotes = 0;
        this.againstVotes = 0;
        this.startDate = new Date();
        this.endDate = new Date(this.startDate.getTime() + sessionMinutes * 60000);
        if(type == "law") {
            this.law = target_id;
        }else if(type == "ruleChange") {
            this.rule = target_id;
            this.ruleValue = value;
        }

        
        for(let user of users) {
            await this.addUser(user);
        }
        
        //await this.vote(users[0].id, "for");
        

        this.isInSession = true;

        setTimeout(() => {
            this.endSession();
        }, sessionMinutes * 60000);
    }

    async getSession() {
        return {
            users: Array.from(this.users.values()),
            inSession: this.isInSession,
            seats: this.seats,
            forVotes: this.forVotes,
            againstVotes: this.againstVotes,
            title: this.title,
            type: this.type,
            law: this.law,
            rule: this.rule,
            ruleValue: this.ruleValue,
            startDate: this.startDate,
            endDate: this.endDate
        }
    }

    async addUser(user) {
        user.vote = "abstain";
        this.users.set(user.id, user);
    }

    async vote(userId, vote) { //vote is either "for" or "against"
        if (this.isInSession && this.users.has(userId)) {
            this.users.get(userId).vote = vote;
            await this.recalculateVotes();
            return true;
        }
        return false;
    }

    async recalculateVotes() {
        this.forVotes = 0;
        this.againstVotes = 0;
        for (let user of this.users.values()) {
            if (user.vote == "for") {
                this.forVotes++;
            } else if(user.vote == "against") {
                this.againstVotes++;
            }
        }
    }

    

    async endSession() {
        this.isInSession = false;

        //Check vote type
        var aNew = {
            title: "",
            subtitle: "",
            content: ""
        }

        if(this.type == "law") {
            const law = await db.getLaw(this.law);
            const party = await db.getParty(law.party_id);
            if(this.forVotes > this.againstVotes) {
                await db.aproveLaw(law.id);
                
            }else {
                await db.rejectLaw(law.id);
            }
        }else if (this.type == "ruleChange") {
            if(this.forVotes > this.againstVotes) {
                await db.changeRule(this.rule, this.ruleValue);
                
            }else {
                
            }
        }
        //Else if mocion de censura


        //Mark session as ended
        await db.endSession(this.session_id);

        //Generate news

        this.clear();
        console.log("Session ended");

        //Disconect webscocket
        broadcast(JSON.stringify({type: "disconnect"}));
    }

    clear() {
        this.users.clear();
        this.seats = 0;
        this.forVotes = 0;
        this.againstVotes = 0;
        this.title = "Votacion";
        this.type = "none";
        this.law = null;
        this.rule = null;
        this.ruleValue = null;
        this.session_id = null;
    }

}

const instance = new SessionManager();
//Object.freeze(instance);

module.exports = instance;