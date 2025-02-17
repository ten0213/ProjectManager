import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';

interface ProjectInput {
  projectName: string;
  description: string;
  isPrivate: boolean;
}

const StyledContainer = styled.div`
  max-width: 600px;
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      color: #666;
    }

    input[type="text"],
    textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input[type="checkbox"] {
      width: 1.2rem;
      height: 1.2rem;
    }

    label {
      font-size: 1rem;
      color: #333;
    }
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    text-align: center;
  }

  button {
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
`;

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    projectName: '',
    description: '',
    isPrivate: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectInput.projectName.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await Axiosbase.post('/api/project/create', projectInput, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      navigate('/project');

    } catch (error: any) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.message || '프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setProjectInput(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
  };

  return (
    <StyledContainer>
      <h2>새 프로젝트 생성</h2>
      <Form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">프로젝트 이름</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={projectInput.projectName}
            onChange={handleChange}
            placeholder="프로젝트 이름을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">프로젝트 설명</label>
          <textarea
            id="description"
            name="description"
            value={projectInput.description}
            onChange={handleChange}
            placeholder="프로젝트 설명을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
            checked={projectInput.isPrivate}
            onChange={handleChange}
            disabled={isLoading}
          />
          <label htmlFor="isPrivate">비공개 프로젝트</label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '생성 중...' : '프로젝트 생성'}
        </button>
      </Form>
    </StyledContainer>
  );
};

export default CreateProject;
