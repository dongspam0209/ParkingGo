import React, {useState} from 'react';
import './Join.css'
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios'
const Join = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  // 에러 메시지 상태를 추가합니다.
    const navigate = useNavigate();  // 페이지 이동을 위해 사용합니다.
    const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인을 위한 상태

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }
    
    const handleConfirm = async () => {
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return; // 더 이상 진행하지 않고 함수를 종료합니다.
        }
        try {
            const response = await axios.post('http://localhost:8080/user/join', {
                Mem_login_id: username,
                Mem_login_pw: password
            });
    
            // 응답에서 사용자의 인증 상태를 확인합니다.
            if (response.data.authenticated) {  
                // 회원가입 성공 시 메인 페이지로 이동합니다.
                navigate('/');
            } else {  
                // 회원가입 실패 시 에러 메시지를 표시합니다.
                setErrorMessage("회원가입에 실패했습니다.");
            }
        } catch (error) {
            setErrorMessage("이미 존재하는 ID입니다.");
        }
    }
    

    return (
        <div className='page'>
            
            <div className='contentWrap'>

                <div className='inputTitle'>아이디</div>
                <div className='inputWrap'>
                    <input className='input' placeholder='UserId' value={username} onChange={handleUsernameChange}/>
                </div>

                <div className='inputTitle'>비밀번호</div>
                <div className='inputWrap'>
                    <input className='input' placeholder='Password' type="password" value={password} onChange={handlePasswordChange}/>
                </div>

                <div className='inputTitle'>비밀번호 확인</div>
                <div className='inputWrap'>
                    <input className='input' placeholder='Confirm Password'  type="password" value={confirmPassword} onChange={handleConfirmPasswordChange}/>
                </div>

                
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}

            </div>

            <div>
                <button className='bottomButton' onClick={handleConfirm}>
                    Sign up
                </button>
                <div>
                    Have an account? <Link to={"/"}><button className='joinButton'>
                        sign in
                        </button>
                        </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default Join;