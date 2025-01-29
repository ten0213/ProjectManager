import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';
import Logout from '../Logout.tsx';
import { Link } from 'react-router-dom';

// 간소화된 프로젝트 타입 정의
interface Project {
  id: number;
  project: string;
  description: string;
  isPrivate: boolean;
}

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
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
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await Axiosbase.get('/api/project/read/project');
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError('프로젝트 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>프로젝트 현황</h1>
        <Link to="/createProject"><button>새 프로젝트 생성</button></Link>
        <button><Logout /></button>
      </Header>
      <ProjectGrid>
        {projects.map((project) => (
         <Link to="/projectdetail"><ProjectCard key={project.id}>
            <ProjectTitle>{project.project}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <PrivacyBadge isPrivate={project.isPrivate}>
              {project.isPrivate ? '비공개' : '공개'}
            </PrivacyBadge>
          </ProjectCard></Link>
        ))}
      </ProjectGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
