import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #1a73e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const UserRole = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

interface HeaderProps {
  userId?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = () => {
      const storedUserId = sessionStorage.getItem('userId');
      if (!storedUserId) {
        navigate('/login');
        return;
      }
      setCurrentUserId(storedUserId);
    };

    checkUserSession();

    // 세션 스토리지 변경 감지
    const handleStorageChange = () => {
      checkUserSession();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <HeaderContainer>
      <ProfileSection>
        <ProfileAvatar>
          {getInitials(currentUserId)}
        </ProfileAvatar>
        <ProfileInfo>
          <UserName>{currentUserId}</UserName>
          <UserRole>로그인된 사용자</UserRole>
        </ProfileInfo>
      </ProfileSection>
    </HeaderContainer>
  );
};

export default Header;
