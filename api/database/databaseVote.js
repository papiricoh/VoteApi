const pool = require("./pool");

const db = {

    async aregister(username, email, password_hash, session_hash, first_name, last_name) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO users (username, email, password, token, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`, [username, email, password_hash, session_hash, first_name, last_name]);
            
            return result;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    },

    
    
}

module.exports = db;