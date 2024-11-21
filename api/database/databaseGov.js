const pool = require("./pool");

const db = {

    async getGovernment() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT users.id AS user_id, government_members.id, government_members.role, users.first_name, users.last_name, users.username, parties.label, parties.name
            FROM government_members
            INNER JOIN users ON government_members.user_id = users.id
            INNER JOIN users_parties ON government_members.user_id = users_parties.user_id
            INNER JOIN parties ON users_parties.party_id = parties.id`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    },

    async createGovernmentRole(user_id, role) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO government_members (user_id, role) VALUES (?, ?)`, [user_id, role]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    },

    async removeFromGovernment(user_id) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`DELETE FROM government_members WHERE user_id = ?`, [user_id]);
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    }

}

module.exports = db;