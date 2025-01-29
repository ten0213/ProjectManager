import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';

interface Project {
  id: number;
  project: string;
  description: string;
  isPrivate: boolean;
}

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
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

const DetailCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProjectTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &.edit {
    background-color: #2196f3;
    color: white;

    &:hover {
      background-color: #1976d2;
    }
  }

  &.delete {
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #d32f2f;
    }
  }

  &.back {
    background-color: #f5f5f5;
    color: #333;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    try {
      const response = await Axiosbase.get(`/api/document/read/all`);
      setProject(response.data);
      setLoading(false);
    } catch (err) {
      setError('프로젝트 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };


  const handleCreate = () => {
    navigate('/createDocument');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <DetailContainer>
      <Header>
        <h1>Document</h1>
      </Header>
      <DetailCard>
        <ProjectTitle>{project.project}</ProjectTitle>
        <PrivacyBadge isPrivate={project.isPrivate}>
          {project.isPrivate ? '비공개' : '공개'}
        </PrivacyBadge>
        <ProjectDescription>{project.description}</ProjectDescription>
        <ButtonGroup>
        <Button className="edit" onClick={handleCreate}>API 작성</Button>
          <Button className="back" onClick={handleBack}>뒤로</Button>

        </ButtonGroup>
      </DetailCard>
    </DetailContainer>
  );
};

export default ProjectDetail;
