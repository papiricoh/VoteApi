class SessionManager {
    constructor() {
        if (!SessionManager.instance) {
            this.users = new Map();
            this.isInSession = false;
            this.seats = 0;
            this.forVotes = 0;
            this.againstVotes = 0;
            SessionManager.instance = this;
            console.log("SessionManager created");
            
        }

        return SessionManager.instance;
    }

    startSession(seats) {
        this.users.clear();
        this.seats = seats;
        this.isInSession = true;

    }

    addUser(userId) {
        this.users.set(userId, true);
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
    }

}

const instance = new SessionManager();
Object.freeze(instance);

module.exports = instance;