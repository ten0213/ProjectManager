import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/Header.scss';

interface HeaderProps {
  userId?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // sessionStorage에서 username(기존 userId)과 loginId 가져오기
  const username = sessionStorage.getItem('userId') || ''; // 기존 userId를 username으로 사용
  const loginId = sessionStorage.getItem('loginId') || username; // loginId가 없다면 username과 동일하게 설정

  useEffect(() => {
    const checkUserSession = () => {
      if (!username) {
        navigate('/login');
        return;
      }
    };

    checkUserSession();
  }, [navigate, username]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !avatarRef.current?.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  if (!username) {
    return null;
  }

  return (
    <div className="header-container">
      <div className="profile-section">
        <div
          ref={avatarRef}
          className="profile-avatar"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          {getInitials(username)}
        </div>
        <div className="profile-info">
          <span className="user-name">{username}</span>
          <span className="user-role">로그인된 사용자</span>
        </div>

        <div ref={popupRef} className={`profile-popup ${isPopupOpen ? 'active' : ''}`}>
          <div className="popup-header">
            <div className="profile-info-extended">
              <div className="popup-avatar">
                {getInitials(username)}
              </div>
              <div className="info">
                <div className="name">{username}</div>
                <div className="role">로그인된 사용자</div>
              </div>
            </div>
          </div>

          <div className="popup-content">
            {/* <div className="menu-item">
              사용자 이름: {username}
            </div> */}
            <div className="menu-item">
              로그인 ID: {loginId}
            </div>
          </div>

          <div className="popup-footer">
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
