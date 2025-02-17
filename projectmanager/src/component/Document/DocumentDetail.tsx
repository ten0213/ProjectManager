import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';

interface Parameter {
  data: string;
  type: string;
  annotation: string;
}

interface Endpoint {
  path: string;
  method: string;
  parameters: Parameter[];
}

interface Document {
  id: number;
  date: string;
  projectId: number;
  endpoints: Endpoint[];
}

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 1.8rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
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
    background-color: #757575;
    color: white;
    &:hover {
      background-color: #616161;
    }
  }
`;

const EndpointCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const EndpointHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const Method = styled.span<{ method: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  margin-right: 1rem;
  font-size: 0.9rem;

  ${({ method }) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'background-color: #e3f2fd; color: #1565c0;';
      case 'POST':
        return 'background-color: #e8f5e9; color: #2e7d32;';
      case 'PUT':
        return 'background-color: #fff3e0; color: #f57c00;';
      case 'DELETE':
        return 'background-color: #ffebee; color: #c62828;';
      default:
        return 'background-color: #f5f5f5; color: #616161;';
    }
  }}
`;

const Path = styled.span`
  font-family: monospace;
  font-size: 1rem;
  color: #333;
`;

const ParameterSection = styled.div`
  padding: 1rem;
`;

const ParameterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 500;
    color: #666;
  }
`;

const CreatedDate = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await Axiosbase.get(`/api/document/read/${id}`);
        setDocument(response.data);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('문서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // const handleEdit = () => {
  //   navigate(`/document/edit/${id}`);
  // };

  // const handleDelete = async () => {
  //   if (window.confirm('이 API 문서를 삭제하시겠습니까?')) {
  //     try {
  //       await Axiosbase.delete(`/api/document/delete/${id}`);
  //       navigate(`/projectdetail/${document?.projectId}`);
  //     } catch (err) {
  //       console.error('Error deleting document:', err);
  //       setError('문서 삭제에 실패했습니다.');
  //     }
  //   }
  // };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!document) return <div>문서를 찾을 수 없습니다.</div>;

  return (
    <Container>
      <Header>
        <div>
          <Title>API 문서 상세</Title>
          <CreatedDate>
            작성일: {new Date(document.date).toLocaleDateString()}
          </CreatedDate>
        </div>
        <ButtonGroup>

          <Button className="back" onClick={handleBack}>뒤로</Button>
        </ButtonGroup>
      </Header>

      {document.endpoints.map((endpoint, index) => (
        <EndpointCard key={index}>
          <EndpointHeader>
            <Method method={endpoint.method}>{endpoint.method.toUpperCase()}</Method>
            <Path>{endpoint.path}</Path>
          </EndpointHeader>
          <ParameterSection>
            <h3>Parameters</h3>
            <ParameterTable>
              <thead>
                <tr>
                  <th>Annotation</th>
                  <th>Type</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.parameters.map((param, paramIndex) => (
                  <tr key={paramIndex}>
                    <td>{param.annotation}</td>
                    <td>{param.type}</td>
                    <td>{param.data}</td>
                  </tr>
                ))}
              </tbody>
            </ParameterTable>
          </ParameterSection>
        </EndpointCard>
      ))}
    </Container>
  );
};

export default DocumentDetail;
