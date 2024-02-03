<h2>Join.js 파일 설명</h2>
<p>User.js 프론트에서 sign up 버튼을 클릭하게 되면 link to ={"/user/join"}으로 이동됨. /user/join은 App.js에서 Join.js로 연결되게 되어있음.

Join.js에서 sign up 버튼을 누르면 post 요청 -> server.js (/user/join 컨트롤러 처리 시작) -> sql.js(addUser 함수 호출 처리: 멤버 정상 insert)->server.js (authenticated true 반환)->Join.js(try 문 if 문에서 authenticated가 트루)-> /로 네비게이트 -> /는 App.js에서 User.js로 라우팅되어 있음.

프론트: 아이디 부분에 value값 username을 입력하면 onChange에 의해 handleUsernameChange 함수가 실행됨.
백엔드:handleUsernameChange 함수는 함수인자로 username을 받게 되고 setUsername(e.target.value);로 set함.
프론트: 비밀번호 부분에 value 값 password를 입력하면 onChagne에 의해 handlePasswordChange 함수가 실행됨.
백엔드:handlePasswordChange 함수는 함수인자로 password를 받게 되고 setPassword(e.target.value);로 set함.
프론트: 비밀번호 확인 부분에 value 값 confirmPassword를 입력하면 onChange에 의해 handleConfirmPasswordChange 함수가 실행됨.
백엔드:handleConfirmPasswordChange 함수는 함수인자로 confirmPassword를 받게 되고 setConfirmPassword(e.target.value);로 set함.
프론트:Sign up 버튼을 클릭 시 onClick에 의해 handleConfirm 함수 실행.
백엔드: handleConfirm 함수에서 if문은 password와 confirmPassword가 서로 일치하지 않으면 에러 메시지를 반환시킴. try 문에서는 await axios를 사용해 http://localhost:8080/user/join로 Post함. 내용은 설정한 아이디와 패스워드를 post한다. 이는 server.js에서 /user/join 부분에서 처리됨. 처리된 내용은 response로 받게 되고 response.data.authenticated가 1이라면 / 초기 페이지로 네이게이트함.</p>

<hr/>

<h2>User.js 파일 설명</h2>
<p>User.js (Post 요청)->server.js (/user 컨트롤러 처리 시작)->sql.js (함수에 쓰이는 sql)-> server.js(다시 server.js로 돌아와서 처리 마무리 한 후 res.send로 결과 반환)->User.js (authenticated 처리 후 /maps 네비게이트)->Map.js

프론트: 먼저 아이디 입력 창에서 value 값 username을 입력하면 onChange로 handleUsernameChange 함수를 실행.
백엔드: handleUsernameChange 함수에서 useState로 정의된 username을 checkUsername(전달된 타겟 value)으로 set해버림.
프론트: 비밀번호 입력 창에서 value 값 password를 입력하면 onChange로 handlePasswordChange 함수를 실행.
백엔드: handlePasswordChange 함수에서 useState로 정의된 password를 checkPassword(전달된 타겟 value)으로 set 해버림.
프론트: Log in 버튼을 클릭하면 onClick에 의해 handleConfirm 함수를 실행.
백엔드: handleConfirm 함수는 async 비동기로 선언된다. try catch 문 안에서 try 부분은 http://localhost:8080/user로 await axios를 사용해 username과 password를 각각 Mem_login_id와 Mem_login_pw로 post한다. http://localhost:8080/user는 server.js(컨트롤러) 부분에서 처리된다. 처리된 것은 response로 리턴되어 User.js에 나타난다. (response의 data의 authenticated가 만약 1이라면 localStorage.setItem으로 로컬에 저장하고 사용할 수 있으나 불필요) navigate로 /maps 이동 요청. /maps는 App.js에서 Map.js로 라우팅 되어 있음.</p>

<hr/>

<h2>Map.js 파일 설명</h2>

<p>fetchParkingData 함수
await axios를 이용하여 http://localhost:8080/getParkingData 경로로 server.js에 get 요청.
이때 response로 값을 받고 dataObj 객체에 아래와 같이 데이터 없데이트 진행.
response.data.forEach(park => {
                        dataObj[park.Pl_id] = {
                            totalSpaces: park.Pl_total_spaces,
                            occupiedSpaces: park.Pl_occupied_spaces
                        }
                    });
setParkingData(dataObj)를 이용해 set해줌.
그 후 fetchParkingData(); 함수 실행시켜서 프론트에서 사용할 수 있도록 함.

프론트엔드에서 마커 클릭하면 정보창이 뜸. -> 정보창을 누르면 /park/:clickedMarkerId 해당 clickedMarkerId로 이동됨. App.js에서 /park/:clickedMarkerId에 대한 route를 Paging 함수로 이동되게 했음. -> Paging 함수에서 if문에 clickedMarkerId == 넘버에 해당되는 곳으로 리턴해줌으로써 라우트가 그 방향으로 이동되게 됨. 즉
<Route path="/park/:clickedMarkerId" element={<Paging />} />에서 <Route path="/park/:1" element={<BuildTwo />} />가 되는 것임.

</p>

<hr/>

# Jungseok.js

### 기본 구조

- **사용된 라이브러리와 훅:** `axios`로 HTTP 요청을 보내고, `React`의 `useState`, `useEffect` 훅을 사용하여 상태 관리와 사이드 이펙트 처리를 합니다.
- **스타일과 UI 구성요소:** `ToggleButton`, `ToggleButtonGroup` 컴포넌트로 사용자 인터페이스를 구성하고, `Jungseok.css`와 `bootstrap`으로 스타일을 적용합니다.

### 상태 관리

- **isParked:** 주차 상태를 `true` 또는 `false`로 관리합니다.
- **parkingData:** 주차 공간 데이터를 배열로 관리합니다.
- **selectedBest, storedPsNumber, buttonStatus, selectedPs:** 각각 최적의 주차 공간, 저장된 주차 공간 번호, 버튼 상태, 선택된 주차 공간을 관리합니다.

### 주요 함수

- **handleToggle:** 사용자가 `ToggleButtonGroup` 내의 버튼을 토글할 때 `selectedBest` 상태를 업데이트합니다.
- **getClassNameForPark:** 주차 공간 번호에 따라 CSS 클래스 이름을 반환합니다. 각 주차 공간에 고유한 스타일을 적용하기 위한 용도입니다.
- **getColorForOccupied:** 주차 공간의 점유 상태에 따라 색상을 반환합니다. 예를 들어, 점유된 상태는 빨간색, 최적의 주차 공간은 파란색으로 표시합니다.
- **useEffect:** 컴포넌트가 마운트될 때 주기적으로 서버에서 주차 공간 데이터를 가져옵니다. `setInterval`을 사용하여 주기적으로 데이터를 업데이트하고, 컴포넌트 언마운트 시 `clearInterval`로 정리합니다.
- **handleButtonClick:** 사용자가 주차 공간 버튼을 클릭할 때 실행되는 함수입니다. 선택된 주차 공간의 번호와 색상 상태를 업데이트합니다.
- **handleParkedClick:** 'Park here?' 버튼을 클릭했을 때 실행되며, 주차 상태를 업데이트합니다.

### 렌더링 로직

- **주차 공간 표시:** `parkingData` 배열을 매핑하여 각 주차 공간을 버튼 또는 div 요소로 표시합니다. 각 요소는 `getClassNameForPark` 함수로부터 반환받은 클래스와 `buttonStyle` 함수로부터 반환받은 스타일을 적용받습니다.
- **주차 공간 선택:** 사용자가 주차 공간을 선택하면, 해당 공간은 'Already Occupied' 또는 'Park here?' 상태로 표시됩니다. 이 상태는 `buttonStatus`에 의해 결정됩니다.
- **토글 버튼 그룹:** 사용자가 주차 공간의 우선 순위(예: 'Easiest to Park', 'Closest to Entry')를 선택할 수 있게 하는 토글 버튼 그룹입니다.

### 스타일링

- **CSS 클래스:** `getClassNameForPark` 함수는 주차 공간의 ID에 따라 고유한 CSS 클래스를 할당합니다. 이 클래스들은 `Jungseok.css`에서 정의된 스타일을 적용받습니다.
- **동적 스타일:** `buttonStyle` 함수는 주차 상태와 선택된 주차 공간에 따라 동적으로 스타일을 결정합니다.

### 네트워크 요청

- **axios 사용:** `useEffect` 내부에서 `axios.get`을 사용하여 서버로부터 주차 공간 데이터를 주기적으로 요청하고, 응답을 받아 상태를 업데이트합니다.

이 컴포넌트는 주차장 관리 애플리케이션의 일부로 사용될 수 있으며, 사용자에게 주차 공간의 실시간 점유 상태를 보여주고, 최적의 주차 공간을 선택할 수 있는 인터페이스를 제공합니다.

<hr/>

# BuildTwo 컴포넌트 설명

### 주요 라이브러리 및 훅 사용

- `React`: UI 구축을 위한 기본 라이브러리.
- `useState`, `useEffect`: 컴포넌트의 상태 관리와 사이드 이펙트를 처리합니다.
- `axios`: HTTP 클라이언트 라이브러리로, 서버로부터 데이터를 비동기적으로 가져옵니다.
- `react-icons`: UI에 아이콘을 쉽게 추가할 수 있게 해줍니다.
- `react-bootstrap`: Bootstrap 컴포넌트를 React에서 사용할 수 있도록 하는 라이브러리.

### 컴포넌트 상태

- `isParked`, `parkingData`, `selectedBest`, `storedPsNumber`, `buttonStatus`, `selectedPs`: 주차 상태, 주차장 데이터, 선택된 주차 공간 등의 정보를 관리합니다.

### 주요 함수 및 효과

- `handleToggle`: 사용자가 주차 공간의 우선 순위(가장 쉽게 주차할 수 있는 공간, 입구와 가장 가까운 공간 등)를 선택할 때 상태를 업데이트합니다.
- `getClassNameForPark`: 주차 공간 번호에 따라 CSS 클래스 이름을 반환합니다.
- `getColorForOccupied`: 주차 공간의 점유 상태에 따라 색상을 반환합니다.
- `useEffect`: 컴포넌트가 마운트될 때 주기적으로 서버로부터 주차 공간 데이터를 가져옵니다.
- `handleButtonClick`: 사용자가 주차 공간을 클릭할 때 상태를 업데이트합니다.
- `handleParkedClick`: 사용자가 '주차하기' 버튼을 클릭했을 때의 로직을 처리합니다.
- `buttonStyle`: 주차 공간 버튼의 스타일을 동적으로 결정합니다.

### 렌더링

- 주차장 레이아웃은 `react-icons`를 사용하여 시각적으로 표현되며, `ToggleButton`과 `ToggleButtonGroup`을 사용하여 주차 우선 순위를 선택할 수 있는 UI를 제공합니다.
- `parkingData` 배열을 매핑하여 각 주차 공간을 동적으로 렌더링합니다. 각 공간은 점유 상태에 따라 다른 스타일을 가집니다.
- 사용자는 주차 공간을 선택하고, 선택된 공간의 상태(점유됨, 선택됨 등)에 따라 다른 메시지를 보여주는 버튼을 클릭할 수 있습니다.

### 작동 원리

1. 컴포넌트가 마운트되면 `useEffect` 훅이 서버로부터 주차 공간 데이터를 주기적으로 가져옵니다.
2. 사용자는 주차 공간을 클릭하여 선택할 수 있으며, 선택된 공간은 상태에 따라 스타일이 변경됩니다.
3. 사용자가 주차 우선 순위를 변경하거나 '주차하기' 버튼을 클릭할 때, 해당 상태는 반영되어 UI에 즉시 표시됩니다.
4. 서버로부터의 데이터는 주기적으로 업데이트되어 최신 상태를 반영합니다.

이 컴포넌트는 React의 선언적 UI 패러다임과 함께 비동기 통신, 상태 관리, 조건부 렌더링 기법을 활용하여 복잡한 동적 인터페이스를 구현하는 좋은 예시입니다.

<hr/>

# App.js 파일 설명

### 1. MySQL 연결 설정

- **라이브러리 사용:** `mysql2` 라이브러리를 사용하여 MySQL 데이터베이스에 연결합니다.
- **연결 풀 생성:** `createPool` 메소드를 통해 데이터베이스 연결 풀을 생성합니다. 이 방법은 여러 데이터베이스 연결을 재사용하고 관리하는 효율적인 방법을 제공합니다.
- **연결 설정 정보:** 연결 설정에는 호스트, 포트, 사용자 이름, 비밀번호, 데이터베이스 이름 등이 포함됩니다.

### 2. Promise 기반 쿼리 실행

- **비동기 처리:** `promisePool`을 생성하여 비동기 방식으로 SQL 쿼리를 실행할 수 있습니다. 콜백 함수 대신 `async/await` 구문을 사용하여 코드의 가독성을 높입니다.

### 3. SQL 쿼리 함수

- **selectSql 객체:** 데이터베이스에서 데이터를 조회하는 여러 함수를 포함합니다.
  - `getParkingData`: 모든 주차장의 정보를 조회합니다.
  - `getParkingSpace_Jeongseok`: ID가 3인 주차장의 주차 공간 정보를 조회합니다.
  - `getParkingSpace_Num2`: ID가 1인 주차장의 주차 공간 정보를 조회합니다.
  - `verifyUser`: 사용자의 로그인 정보를 검증합니다.
- **insertSql 객체:** 데이터베이스에 데이터를 삽입하는 함수를 포함합니다.
  - `addUser`: 새로운 사용자를 추가합니다.
- **modifySql 객체:** 데이터베이스의 데이터를 수정하는 함수를 포함합니다.
  - `modifyParkingStatus`: 주차 공간의 점유 상태 및 기타 정보를 업데이트합니다. 트랜잭션을 사용하여 여러 업데이트를 원자적으로 처리합니다.

### App.js 작동 원리

이 코드는 주차장 관리 시스템의 서버 측에서 데이터베이스와의 상호 작용을 담당합니다. 사용자 요청에 따라 적절한 SQL 쿼리를 실행하고, 결과를 클라이언트로 반환합니다. `async/await` 구문을 사용하여 비동기 데이터베이스 작업을 동기식 코드의 형태로 쉽게 처리할 수 있습니다. 데이터베이스 작업 중 오류가 발생하면, 트랜잭션을 롤백하여 데이터 일관성을 유지합니다.

<hr/>

# sql.js

MySQL 데이터베이스를 연결하고 조작하는 방법에 대해 설명합니다. 데이터베이스 연결 풀 생성, 데이터 조회, 삽입, 수정에 대한 세부 사항을 다룹니다.

## 데이터베이스 연결 설정

### 연결 풀 생성

`mysql.createPool`을 사용하여 데이터베이스 연결 풀을 생성합니다. 연결 풀을 사용하면 여러 연결을 효율적으로 관리하고 재사용할 수 있습니다.

연결 설정 정보:

- **host:** 데이터베이스 서버 호스트
- **port:** 데이터베이스 서버 포트
- **user:** 데이터베이스 사용자 이름
- **password:** 데이터베이스 비밀번호
- **database:** 사용할 데이터베이스 이름

## 데이터 조회 (selectSql 객체)

### `getParkingData` 함수

- **SQL 쿼리:** `SELECT Pl_id, Pl_total_spaces, Pl_occupied_spaces FROM parking_lot ORDER BY Pl_id`
- **기능:** 모든 주차장의 ID, 총 주차 공간 수, 현재 점유된 주차 공간 수를 조회합니다.

### `getParkingSpace_Jeongseok` 함수

- **SQL 쿼리:** `SELECT * FROM parking_space WHERE Parking_lot_Pl_id = 3 ORDER BY Ps_ID`
- **기능:** ID가 3인 주차장의 모든 주차 공간 정보를 조회합니다.

### `getParkingSpace_Num2` 함수

- **SQL 쿼리:** `SELECT * FROM parking_space WHERE Parking_lot_Pl_id = 1 ORDER BY Ps_ID`
- **기능:** ID가 1인 주차장의 모든 주차 공간 정보를 조회합니다.

### `verifyUser` 함수

- **SQL 쿼리:** `SELECT * FROM member WHERE Mem_login_id = ? AND Mem_login_pw = ?`
- **기능:** 제공된 사용자 ID와 비밀번호가 일치하는 회원 정보를 조회합니다.

## 데이터 삽입 (insertSql 객체)

### `addUser` 함수

- **SQL 쿼리:** `INSERT INTO member (Mem_login_id, Mem_login_pw) VALUES (?, ?)`
- **기능:** 새로운 사용자를 회원 테이블에 추가합니다.

## 데이터 수정 (modifySql 객체)

### `modifyParkingStatus` 함수

- **SQL 쿼리:** `UPDATE parking_space SET Ps_isOccupied = ?, Ps_best = ? WHERE Ps_number = ? AND Parking_lot_Pl_id = ?`
- **기능:** 주어진 주차 공간의 점유 상태와 우선 순위를 업데이트합니다.

## 작동 원리

- `promisePool.query`: 비동기 쿼리 실행을 위해 프로미스 기반의 풀을 사용합니다. `async/await` 구문으로 비동기 처리를 간결하게 관리할 수 있습니다.
- `promisePool.getConnection`: 수정 작업에서 트랜잭션을 관리하기 위해 개별 연결을 가져옵니다. 연결을 통해 트랜잭션을 시작, 커밋, 롤백할 수 있습니다.
</hr>
