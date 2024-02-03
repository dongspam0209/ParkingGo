import React, {useState} from 'react';

import './User.css'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios'

const User = () => {

    const [username, checkUsername] = useState("");
    const [password, checkPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  // 에러 메시지 상태를 추가합니다.
    const navigate = useNavigate();  // 페이지 이동을 위해 사용합니다.

    const handleUsernameChange = (e) => {
        checkUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        checkPassword(e.target.value);
    }

    const handleConfirm = async () => {
        try {
            const response = await axios.post('http://localhost:8080/user', {
                Mem_login_id: username,
                Mem_login_pw: password
            });

            // 응답에서 사용자의 인증 상태를 확인합니다.
            if (response.data.authenticated) {  // 인증이 성공하면 '/'로 이동합니다.
                localStorage.setItem('userId', response.data.userId)
                navigate('/maps');
            } else {  // 인증이 실패하면 에러 메시지를 표시합니다.
                setErrorMessage("비밀번호가 틀렸습니다.");
            }
        } catch (error) {
            console.error("Error inserting data: ", error);
            setErrorMessage("서버 에러가 발생했습니다.");
        }
    }


    return (
        <div className='page'>
            <div className='titleWrap'>
                아이디와 비밀번호를
                <br />
                입력해주세요
            </div>

            <div className='contentWrap'>

                <div className='inputTitle'>아이디</div>
                <div className='inputWrap'>
                    <input className='input' value={username} onChange={handleUsernameChange} />
                </div>

                <div className='inputTitle'>비밀번호</div>
                <div className='inputWrap'>
                    <input className='input' type="password" value={password} onChange={handlePasswordChange} />
                </div>

                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
               
            </div>

            <div>
                <button type="button" className='bottomButton' onClick={handleConfirm}>
                Log in
                </button>
                <div>
                    Forgot password? <Link to={"/user/join"}><button className='joinButton'>
                        sign up
                        </button>
                        </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default User;
