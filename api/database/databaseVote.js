const pool = require("./pool");

const db = {

    async getGovernment() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`SELECT * FROM government_members`);
            return rows;
        }catch (err) {
            throw new Error("DB error: " + err);
        }
    }
    
    
}

module.exports = db;