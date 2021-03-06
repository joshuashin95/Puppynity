import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
// import { useSelector } from 'react-redux';
import LogoImg from '../Assets/puppynityLogo.svg';
// import LoginType from '../Redux/authSlice';

const Nav = styled.div`
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
  border-bottom: 1px solid #aaa;
`;

const NavLink = styled(Link)`
  font-weight: bold;
  color: #ffa224;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem;
  height: 100%;
  cursor: pointer;

  &.active {
    color: #777;
  }

  &:hover {
    transition: all 0.2s ease-in-out;
    color: #777;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    dispaly: none;
  }
`;

const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #ffa224;
  padding: 10px 22px;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-weight: bold;
  margin-left: 10px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #ffa224;
  }
`;

const NavLogo = styled(Link)`
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem;
  height: 100%;
  cursor: pointer;
  /* filter: invert(100%); */
  margin-left: 24px;

  &.active {
    color: #e29091;
  }

  &:hover {
    transition: all 0.2s ease-in-out;

    filter: invert(50%);
    /* filter: opacity(0.5) drop-shadow(0 0 0 #ff0000); */
  }
`;

// ==========================여기까지 스타일===========================

function NavBar() {
  // const loginStatus = useSelector((state) => state.isLogin);
  return (
    <Nav>
      <NavLogo to="/" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
        <img src={LogoImg} alt="LogoImg" width="50" height="50" />
      </NavLogo>
      <NavMenu>
        <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
          커뮤니티
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
          채팅하기
        </NavLink>
      </NavMenu>
      <NavBtn>
        <NavBtnLink to="/signup">회원가입</NavBtnLink>
        <NavBtnLink to="/login">로그인</NavBtnLink>
      </NavBtn>
      {/* isLogin 데려와서 3항연산 시전
      <NavBtn>
        <NavBtnLink to="/mypage">마이페이지</NavBtnLink>
        <NavBtnLink to="/" --로그아웃 함수 자리-->로그아웃</NavBtnLink>
      </NavBtn> */}
    </Nav>
  );
}

export default NavBar;
