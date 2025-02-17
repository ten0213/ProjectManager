import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import Axiosbase from '../Axiosbase.tsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  text-align: center;
  padding: 0.05rem;
  top: 0.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const StyledContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.9rem;
        color: #666;
      }

      input {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        &:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      }
    }

    .error-message {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      text-align: center;
    }

    button {
      width: 100%;  // width: 100% 추가하여 StyledLink와 동일한 너비
      margin-top: 1rem;
      padding: 0.9rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }

    .signup-button {
      background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        display: block;
        text-decoration: none;
        text-align: center;
        padding: 0,9rem;
        width: 100%;
        margin-top: 1rem;



      &:hover {
        background-color: #5a6268;
      }
    }
  }
`;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState({
      loginId: '',
      password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!loginInput.loginId || !loginInput.password) {
        setError('아이디와 비밀번호를 입력해주세요.');
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await Axiosbase.post('api/auth/login', loginInput, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { token } = response.data;
        sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', loginInput.loginId);

        Axiosbase.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate('/project');

      } catch (error: any) {
        // ... (error handling)
      } finally {
        setIsLoading(false);
      }
    };


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginInput(prev => ({
        ...prev,
        [name]: value,
      }));
      setError('');
    };

    return (
      <div>
        <StyledContainer>
          <h2>로그인</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginID">아이디</label>
              <input
                type="text"
                id="loginId"
                name="loginId"
                value={loginInput.loginId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={loginInput.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={isLoading}>
              {isLoading ? '처리중...' : '로그인'}
            </button>

            <StyledLink to="/signup">회원가입</StyledLink>
          </form>
        </StyledContainer>
      </div>
    );
  };
export default Login;
