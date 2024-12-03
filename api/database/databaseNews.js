const pool = require("./pool");

const db = {

    async getAllNews() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query("SELECT * FROM news ORDER BY date DESC");
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },

    async insertNew(title, subtitle, content, author, type) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`INSERT INTO news (title, subtitle, content, author, type) VALUES (?, ?, ?, ?, ?)`, [title, subtitle, content, author, type]);
            return rows.insertId;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },
    

}

module.exports = db;