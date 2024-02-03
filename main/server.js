const express = require('express');
const cors = require('cors');
const { selectSql, insertSql, modifySql } = require('./src/sql.js');
const app = express();
const fs = require('fs').promises;

//클라이언트 앱과 서버가 동일한 도메인 및 포트에서 실행되지 않으면 cors문제가 발생할수도


app.use(cors());
app.use(express.json());

app.get('/getParkingData', async(req, res) => {
    try {
        const parkingData = await selectSql.getParkingData();
        res.json(parkingData);
    } catch (error) {
        console.error('Error fetching parking data: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});


app.get('/parking_space/jeongseok', async (req, res) => {
    try {
        const parkingDataString = await fs.readFile('./src/230824_jeongseok.json', 'utf8');
        const parkingData = JSON.parse(parkingDataString);
        // Replace with the actual path to your JSON file if needed
        await modifySql.modifyParkingStatus(parkingData, 3); // Pass parkingData and the parking lot ID for Jeongseok

        const ParkingSpace = await selectSql.getParkingSpace_Jeongseok();
        res.json({
            ParkingSpace,
            success: true,
        });
    } catch (error) {
        console.error("Database error: ", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

app.get('/parking_space/num2', async (req, res) => {
    try {
        const parkingDataString = await fs.readFile('./src/num2.json', 'utf8');
        const parkingData = JSON.parse(parkingDataString); // Replace with the actual path to your JSON file if needed
        await modifySql.modifyParkingStatus(parkingData, 1); // Pass parkingData and the parking lot ID

                // JSON 데이터가 배열을 포함하는 객체인 경우:
        // const parkingDataArray = parkingData.parkingLots; // 'parkingLots'는 실제 배열을 포함하는 키입니다.
        // const parkingSpaceA4 = parkingDataArray.find(p => p.ID === 'A4');

        // if (parkingSpaceA4) {
        //     console.log(`ID A4's occupied status is: ${parkingSpaceA4.occupied}`); // 'occupied'도 실제 속성에 맞게 변경해야 합니다.
        // } else {
        //     console.log('Parking space A4 not found');
        // }

        const ParkingSpace = await selectSql.getParkingSpace_Num2();
        res.json({
            ParkingSpace,
            success: true,
        });
    } catch (error) {
        console.error("Database error: ", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

// 회원가입 라우트
app.post('/user', async (req, res) => {
    const { Mem_login_id, Mem_login_pw } = req.body;

    try {
        const user = await selectSql.verifyUser(Mem_login_id, Mem_login_pw);
        if (user.length > 0) {
            // 사용자 검증에 성공했을 때
            res.send({ authenticated: true });
        } else {
            // 사용자 검증에 실패했을 때
            res.send({ authenticated: false });
        }
    } catch (err) {
        console.error("Error verifying user:", err);
        res.status(500).send({ error: 'Database error' });
    }
});



app.post('/user/join', async (req, res) => {
    const { Mem_login_id, Mem_login_pw } = req.body;

    try {
        await insertSql.addUser(Mem_login_id, Mem_login_pw);
        res.send({ authenticated: true });  // 회원가입 성공 시 인증 상태를 true로 전달합니다.
    } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).send({ error: 'Database error' });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});