const pool = require("./pool");

const db = {

    async getAllNews() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query("SELECT * FROM news ORDER BY date DESC LIMIT 20");
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }finally {
            connection.release();
        }
    },


    async getNew(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query("SELECT * FROM news WHERE id = ? LIMIT 1", [id]);
            return rows[0];
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