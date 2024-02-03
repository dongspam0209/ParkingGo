const mysql = require( "mysql2");

const pool = mysql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'parking',
});

const promisePool = pool.promise();

// select query
const selectSql = {
    getParkingData: async () => {
        const sql = `SELECT Pl_id, Pl_total_spaces, Pl_occupied_spaces FROM parking_lot ORDER BY Pl_id`;
        const [result] = await promisePool.query(sql);
        // console.log(result);
        return result;
    },
    getParkingSpace_Jeongseok: async () => {
        const sql = `SELECT * FROM parking_space WHERE Parking_lot_Pl_id = 3 ORDER BY Ps_ID`;
        const [result] = await promisePool.query(sql);
        return result;
    },

    // New function to get parking spaces for num2
    getParkingSpace_Num2: async () => {
        const sql = `SELECT * FROM parking_space WHERE Parking_lot_Pl_id = 1 ORDER BY Ps_ID`;
        const [result] = await promisePool.query(sql);
        return result;
    },
    verifyUser: async (Mem_login_id, Mem_login_pw) => {
        const sql = "SELECT * FROM member WHERE Mem_login_id = ? AND Mem_login_pw = ?";
        const [result] = await promisePool.query(sql, [Mem_login_id, Mem_login_pw]);
        return result;
    },


    
}

const insertSql = {
    addUser: async (Mem_login_id, Mem_login_pw) => {
        const sql = "INSERT INTO member (Mem_login_id, Mem_login_pw) VALUES (?, ?)";
        const [result] = await promisePool.query(sql, [Mem_login_id, Mem_login_pw]);
        return result;
    }
};
const modifySql = {
    modifyParkingStatus: async (parkingData, plId) => {
        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();
            for (let item of parkingData.parking_status) {
                const sql = `UPDATE parking_space SET Ps_isOccupied = ?, Ps_best = ? 
                             WHERE Ps_number = ? AND Parking_lot_Pl_id = ?`;
                const values = [item.occupied ? 1 : 0, item.Ps_best, item.ID, plId];
                const [result] = await connection.query(sql, values);
                // if (result.affectedRows > 0) {
                //     console.log(`Parking space ${item.ID} updated successfully.`);
                // } else {
                //     console.log(`Parking space ${item.ID} not updated.`);
                // }
            }
            await connection.commit();
            console.log('All modifications committed successfully.');
        } catch (err) {
            await connection.rollback();
            console.error(`Transaction failed and rolled back: `, err);
        } finally {
            connection.release();
        }
    },
    // ... other functions
};




module.exports = {
    selectSql,
    modifySql,
    insertSql

  };
  