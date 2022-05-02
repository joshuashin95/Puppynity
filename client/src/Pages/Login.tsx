import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // store에있는 상태 꺼내오기가능
/* eslint-disable */
import { login } from '../Redux/userSlice';
import LogoImg from '../Assets/puppynityLogo.svg';
import KakaoLogin from '../Assets/kakao_login_medium.png';

const InputContainer = styled.div`
  align-items: center;
  margin-top: 30%;
  width: '200px';
  height: 40%;
  border-radius: 30%;
  background-color: papayawhip;
`;

const Button = styled.button`
  font-size: '1em';
  margin: '20px';
  padding: '0.25em' '1em';
  border: '5px' solid red;
  border-radius: '5px';
  background-color: white;
  width: '80px';
  height: '40px';
  cursor: 'pointer';
`;

export default function Login() {
  // const { login } = useSelector((state) => state.);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      login({
        email: email,
        password: password,
        loggedIn: true,
      }),
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login">
      <InputContainer>
        <img src={LogoImg} className="logo" style={{ width: '200px', height: '200px', margin: '20px' }} />
        <div>
          <form className="login_form" onSubmit={(e) => handleSubmit(e)}>
            {/* onsubmit prevents websites refreshing */}
            <span>Email: </span>
            <input onChange={(e) => handleEmailChange(e)} className="userEmail" placeholder="please write your email" />
            <br />
            <br />
            <span>Password: </span>
            <input onChange={(e) => handlePassword(e)} className="pwd" type="password" placeholder="비밀번호" />
            <br />
            <br />
            <button className="btn-login" type="submit">
              Login
            </button>
            <br />
            <img
              src={KakaoLogin}
              className="kakao-login"
              onClick={() => alert('준비중입니다')}
              style={{ width: '80px', height: '40px', margin: '20px', cursor: 'pointer' }}
            />
          </form>
        </div>
      </InputContainer>
    </div>
  );
}