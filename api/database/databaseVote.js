const pool = require("./pool");

const db = {

    async getGovernment() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT government_members.id, government_members.role, users.first_name, users.last_name, users.username, parties.label, parties.name
            FROM government_members
            INNER JOIN users ON government_members.user_id = users.id
            INNER JOIN users_parties ON government_members.user_id = users_parties.user_id
            INNER JOIN parties ON users_parties.party_id = parties.id`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async createParty(name, label, ideology, user_id, logo, color) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO parties (name, label, ideology, leader, logo, color) VALUES (?, ?, ?, ?, ?, ?)`, [name, label, ideology, user_id, logo, color]);
            
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async addToParty(user_id, party_id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO users_parties (user_id, party_id) VALUES (?, ?)`, [user_id, party_id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async joinParty(user_id, party_id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(
                `UPDATE users_parties SET party_id = ? WHERE user_id = ?`,
                [party_id, user_id]
            );
            return result[0].affectedRows; // Devuelve el número de filas afectadas
        } catch (err) {
            throw new Error("DB error: " + err);
        } finally {
            connection.release();
        }
    },

    async leaveParty(user_id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`DELETE FROM users_parties WHERE user_id = ?`, [user_id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getParty(id) {
        const connection = await pool.getConnection();
        try {
            const query = `Select * from parties where id = ?`;
            const [rows] = await connection.query(query, [id]);
            
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async deleteParty(id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`DELETE FROM parties WHERE id = ?`, [id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getPartyMembers(id) {
        const connection = await pool.getConnection();
        try {
            const query = `Select * from users_parties where party_id = (SELECT id FROM parties WHERE id = ?)`;
            const [rows] = await connection.query(query, [id]);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getUserParty(id) {
        const connection = await pool.getConnection();
        try {
            const query = `Select * from parties where id = (SELECT party_id FROM users_parties WHERE user_id = ?)`;
            const [rows] = await connection.query(query, [id]);
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async changePartyLeader(user_id, party_id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE parties SET leader = ? WHERE id = ?`, [user_id, party_id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getPartyByUserId(user_id) {
        const connection = await pool.getConnection();
        try {
            const query = `
            SELECT parties.*
            FROM parties
            INNER JOIN users_parties ON parties.id = users_parties.party_id
            WHERE users_parties.user_id = ?
            `;
            const [rows] = await connection.query(query, [user_id]);
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getAllParties() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT parties.*, COUNT(users_parties.user_id) AS members
            FROM parties
            LEFT JOIN users_parties ON parties.id = users_parties.party_id
            GROUP BY parties.id`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },
    

    /**
     * Laws DB
     */
    async createLaw(name, description, party_id, user_id, articles) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO laws (title, description, party_id, user_id, status) VALUES (?, ?, ?, ?, 'pending')`, [name, description, party_id, user_id]);
            const law_id = result[0].insertId;
            for (let i = 0; i < articles.length; i++) {
                await connection.query(`INSERT INTO articles (law_id, title, content) VALUES (?, ?, ?)`, [law_id, articles[i].title, articles[i].content]);
            }
            return law_id;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getAllLaws() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM laws`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getAllPendingLaws() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM laws WHERE status = 'pending'`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getAllSignedLaws() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM laws WHERE status = 'signed'`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getLaw(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM laws WHERE id = ?`, [id]);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async signLaw(id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE laws SET status = 'signed' WHERE id = ?`, [id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async rejectLaw(id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE laws SET status = 'rejected' WHERE id = ?`, [id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async aproveLaw(id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE laws SET status = 'aproved' WHERE id = ?`, [id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getLawArticles(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM articles WHERE law_id = ?`, [id]);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getAllRules() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM rules`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },


    async getRule(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM rules WHERE id = ?`, [id]);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async insertSession(user_id, type, target_id, value, title) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO sessions (user_id, type, target_id, value, title) VALUES (?, ?, ?, ?, ?)`, [user_id, type, target_id, value, title]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getPendingSessions() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM sessions WHERE completed = 0 ORDER BY session_date ASC`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getSession(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM sessions WHERE id = ?`, [id]);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async endSession(id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE sessions SET completed = 1 WHERE id = ?`, [id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getCountUsers() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT id, username, first_name, last_name FROM users GROUP BY id`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async getUser(user_id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM users WHERE id = ?`, [user_id]);
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async changeRule(id, value) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE rules SET value = ? WHERE id = ?`, [value, id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },
}

module.exports = db;