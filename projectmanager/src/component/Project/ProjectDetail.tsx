import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';

interface Project {
  id: number;
  project: string;
  description: string;
  isPrivate: boolean;
  projectName: string;

}

interface MethodBadgeProps {
  method: string;
}

interface Document {
  id: number;
  date: string;
  endpoints: Endpoint[];
}

interface Endpoint {
  path: string;
  method: string;
  parameters: Parameter[];
}

interface Parameter {
  annotation: string;
  type: string;
  data: string;
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
const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #1a73e8;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background-color: #1a73e8;
    border-radius: 2px;
  }
`;
const EndpointInfo = styled.div`
  margin: 1rem 0;
  padding: 1.2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
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
const DocumentSection = styled.div`
  margin-top: 2rem;
`;

const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const DateBadge = styled.div`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #e3f2fd;
  color: #1565c0;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const MethodBadge = styled.span<MethodBadgeProps>`
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-right: 1rem;
  background-color: ${({ method }) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#4caf50';
      case 'POST': return '#2196f3';
      case 'PUT': return '#ff9800';
      case 'DELETE': return '#f44336';
      default: return '#757575';
    }
  }};
  color: white;
`;

const PathText = styled.span`
  font-family: monospace;
  color: #333;
`;

const ParameterList = styled.div`
  margin-left: 1rem;
  padding: 0.5rem 0;
`;

const ParameterItem = styled.div`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
`;
interface PrivacyBadgeProps {
  $isPrivate: boolean;
}

const PrivacyBadge = styled.span<PrivacyBadgeProps>`
  background-color: ${({ $isPrivate }) => $isPrivate ? '#fff3e0' : '#e8f5e9'};
  color: ${({ $isPrivate }) => $isPrivate ? '#f57c00' : '#388e3c'};
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
  var { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    Promise.all([
      fetchProjectDetail(),
      fetchDocuments()
    ]).finally(() => setLoading(false));
  }, [id]);

  const fetchProjectDetail = async () => {
    try {

      const response = await Axiosbase.get(`/api/project/read/${id}`);
      setProject(response.data);
    } catch (err) {
      setError('프로젝트 정보를 불러오는데 실패했습니다.');
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await Axiosbase.get(`/api/document/read/all`);
      setDocuments(response.data);
    } catch (err) {
      setError('문서 목록을 불러오는데 실패했습니다.');
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;
  localStorage.setItem('id', `${id}`);
  return (
    <DetailContainer>
      <Header>
        <h1>Document</h1>
      </Header>
      <DetailCard>
        <ProjectTitle>{project.projectName}</ProjectTitle>
        <PrivacyBadge $isPrivate={project.isPrivate}>
          {project.isPrivate ? '비공개' : '공개'}
        </PrivacyBadge>
       <ProjectDescription> <br />프로젝트 설명:{project.description}</ProjectDescription>

        <DocumentSection>
  <SectionTitle>API 문서 목록</SectionTitle>
  {documents.length > 0 ? (
    documents.map((doc, index) => (
      <DocumentCard key={doc.id || index}>
        <DateBadge>
          작성일: {new Date(doc.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </DateBadge>
        {doc.endpoints.map((endpoint, endpointIndex) => (
          <EndpointInfo key={endpointIndex}>
            <div>
              <MethodBadge method={endpoint.method}>
                {endpoint.method.toUpperCase()}
              </MethodBadge>
              <PathText>{endpoint.path}</PathText>
            </div>
            <ParameterList>
              {endpoint.parameters.map((param, paramIndex) => (
                <ParameterItem key={paramIndex}>
                  <span style={{ fontWeight: 500 }}>{param.annotation}</span> <br />
                type:  <span style={{ color: '#6c757d' }}>{param.type}</span><br />
              data:    <span>{param.data}</span>
                </ParameterItem>
              ))}
            </ParameterList>
          </EndpointInfo>
        ))}
      </DocumentCard>
    ))
  ) : (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
      등록된 API 문서가 없습니다.
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        상단의 'API 작성' 버튼을 클릭하여 새로운 API 문서를 작성해보세요.
      </p>
    </div>
  )}
</DocumentSection>

        <ButtonGroup>
          <Button
            className="edit"
            onClick={() => navigate(`/document/create/${id}`)}>
            API 작성
          </Button>
          <Button className="back" onClick={() => navigate("/project")}>
            뒤로
          </Button>
        </ButtonGroup>
      </DetailCard>
    </DetailContainer>
  );
};

export default ProjectDetail;
