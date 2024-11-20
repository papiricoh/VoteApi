const { get } = require("../../api");
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
        }
    },

    async createParty(name, label, ideology, user_id, logo) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO parties (name, label, ideology, leader, logo) VALUES (?, ?, ?, ?, ?)`, [name, label, ideology, user_id, logo]);
            const result2 = await connection.query(`INSERT INTO users_parties (user_id, party_id) VALUES (?, ?)`, [user_id, result[0].insertId]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    },

    async getParty(id) {
        const connection = await pool.getConnection();
        try {
            const query = `
            SELECT parties.*
            FROM users
            INNER JOIN users_parties ON users.id = users_parties.user_id
            INNER JOIN parties ON users_parties.party_id = parties.id
            WHERE users.id = ? LIMIT 1;
            `;
            const [rows] = await connection.query(query, [id]);
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    }
    
    
}

module.exports = db;