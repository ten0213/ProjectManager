import React, { useState } from 'react';
import '../scss/Signup.scss';
import Axiosbase from '../Axiosbase.tsx';
interface SignupForm {
  username: string;
  password: string;
  confirmPassword: string;
  loginId: string;

}

function Signup() {
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    password: '',
    confirmPassword: '',
    loginId: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.password || !formData.confirmPassword ||  !formData.loginId) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError('');

      const response = await Axiosbase.post('api/auth/signup', {
        username: formData.username,
        password: formData.password,
        loginId: formData.loginId,
      });

      if (response.status === 200) {
        window.alert('회원가입이 완료되었습니다. 로그인해주세요.');

        window.location.href = '/';
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>회원가입</h2>



      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="loginId">아이디</label>
          <input
            type="text"
            id="loginId"
            name="loginId"
            value={formData.loginId}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            disabled={isLoading}
          />
        </div>



        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            disabled={isLoading}
          />
        </div>


        <div className="form-group">
          <label htmlFor="username">이름</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            disabled={isLoading}
          />
        </div>




        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
