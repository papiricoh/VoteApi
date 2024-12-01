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
            const result2 = await connection.query(`INSERT INTO users_parties (user_id, party_id) VALUES (?, ?)`, [user_id, result[0].insertId]);
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
            const result = await connection.query(`INSERT INTO users_parties (user_id, party_id) VALUES (?, ?)`, [user_id, party_id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
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

    async getUserParty(id) {
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
    }

}

module.exports = db;