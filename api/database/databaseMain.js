const pool = require("./pool");

const db = {
    async test() {
        const connection = await pool.getConnection();
        const sql = "SELECT * FROM users";
        const [rows] = await connection.query(sql);
        connection.release();
        return rows;
    },

    async register(username, email, password_hash, session_hash, first_name, last_name) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`INSERT INTO users (username, email, password, token, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`, [username, email, password_hash, session_hash, first_name, last_name]);
            
            return result[0].insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },


    async getUserWithUsername(username) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM users WHERE username = ? LIMIT 1`, [username]);
            if(rows.length != 1) {
                throw new Error("No username in db");
            }
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },


    async getUserWithId(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
            if(rows.length != 1) {
                throw new Error("No id in db");
            }
            return rows[0];
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async newToken(id, token) {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(`UPDATE users SET token=? WHERE id=?;`, [token, id]);
            
            
            if(result[0].changedRows != 1) {
                throw new Error("DB error: " + err);
            }
            return token;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    
}

module.exports = db;