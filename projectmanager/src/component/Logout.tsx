import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../Axiosbase.tsx';

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        if(window.confirm("로그아웃 하시겠습니까?") === true){



            await Axiosbase.post('api/auth/logout', {}, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });

              sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    delete Axiosbase.defaults.headers.common['Authorization'];

              // 로그인 페이지로 리다이렉트
              navigate('/login');

      // 백엔드 로그아웃 API 호출
            }
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);

      // 에러가 발생하더라도 로컬의 토큰은 제거하고 로그인 페이지로 이동
      localStorage.removeItem('token');
      delete Axiosbase.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;
