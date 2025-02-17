import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';
import Logout from '../Logout.tsx';
import { Link, useNavigate } from 'react-router-dom';  // useNavigate 추가
import Header from '../Header.tsx';

interface Project {
  id: number;
  projectName: string;
  description: string;
  isPrivate: boolean;
  date: string;
  projectCreator: string;
}


const DashboardContainer = styled.div`
  background-color: #f5f6f8;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Headerr = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background-color: #d32f2f;
  }

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;
const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

interface PrivacyBadgeProps {
  isPrivate: boolean;
}

const PrivacyBadge = styled.span<PrivacyBadgeProps>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${({ isPrivate }) => isPrivate ? '#fff3e0' : '#e8f5e9'};
  color: ${({ isPrivate }) => isPrivate ? '#f57c00' : '#388e3c'};
`;

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();  // useNavigate 훅 사용

  const userId = sessionStorage.getItem('userId') || '';

  useEffect(() => {
    // 세션 체크 추가
    const checkSession = () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');  // navigate 함수 사용
      }
    };

    checkSession();
    fetchProjects();
  }, [navigate]);  // navigate를 의존성 배열에 추


  const fetchProjects = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await Axiosbase.get<Project[]>('/api/project/read/project', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('프로젝트 로딩 에러:', err);
      setError('프로젝트 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: number, e: React.MouseEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (window.confirm('이 프로젝트를 삭제하면 관련된 모든 문서도 함께 삭제됩니다. 계속하시겠습니까?')) {
      try {
        await Axiosbase.post(`api/project/delete/${projectId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(projects.filter(project => project.id !== projectId));
        alert('프로젝트가 성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error('프로젝트 삭제 실패:', err);
        alert('프로젝트 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardContainer>
    <Header userId={userId} />
    <ContentContainer>
      <DashboardHeader>
        <h1>내 프로젝트</h1>
        <div>
          <Link to="/createProject">
            <button>새 프로젝트 생성</button>
          </Link>
          <button><Logout /></button>
        </div>
      </DashboardHeader>
      <ProjectGrid>
        {projects.map((project) => (
          <Link to={`/projectdetail/${project.id}`} key={project.id}>
            <ProjectCard>
              <DeleteButton
                onClick={(e) => handleDelete(project.id, e)}
                aria-label="프로젝트 삭제"
              >
                삭제
              </DeleteButton>
              <ProjectTitle>{project.projectName}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <PrivacyBadge isPrivate={project.isPrivate}>
                {project.isPrivate ? '비공개' : '공개'}
              </PrivacyBadge>
            </ProjectCard>
          </Link>
        ))}
      </ProjectGrid>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
