const Queue = require('./utils/Queue');
const dbVote = require('../database/databaseVote');

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

    async startSession(seats, type, target_id, value, title, users) {
        this.users.clear();
        this.seats = seats;
        this.type = type;
        this.title = title;
        this.forVotes = 0;
        this.againstVotes = 0;
        if(type == "law") {
            this.law = target_id;
        }else if(type == "ruleChange") {
            this.rule = target_id;
            this.ruleValue = value;
        }

        
        for(let user of users) {
            await this.addUser(user);
        }
        
        

        this.isInSession = true;
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
            ruleValue: this.ruleValue
        }
    }

    async addUser(user) {
        user.vote = "abstain";
        this.users.set(user.id, user);
    }

    async vote(userId, vote) { //vote is either "for" or "against"
        if (this.users.has(userId)) {
            this.users.get(userId).vote = vote;
            await recalculateVotes();
            return true;
        }
        return false;
    }

    async recalculateVotes() {
        this.forVotes = 0;
        this.againstVotes = 0;
        for (let user of this.users) {
            if (user.vote == "for") {
                this.forVotes++;
            } else if(user.vote == "against") {
                this.againstVotes++;
            }
        }
    }

    

    endSession() {
        this.isInSession = false;

        //Check vote type

        //Generate news

        this.clear();
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
    }

}

const instance = new SessionManager();
//Object.freeze(instance);

module.exports = instance;