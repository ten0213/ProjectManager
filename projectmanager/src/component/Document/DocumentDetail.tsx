import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Axiosbase from "../../Axiosbase.tsx";

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
  writer: string;
}
const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;

  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;

`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.025em;

  &.edit {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  }

  &.delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  }

  &.back {
    background: white;
    color: #4f46e5;
    border: 2px solid #e0e7ff;
    &:hover {
      background: #f5f7ff;
      border-color: #818cf8;
      transform: translateY(-1px);
    }
  }
`;

const EndpointCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  margin-bottom: 2rem;
  overflow: hidden;
  border: 1px solid #e8eeff;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 28px rgba(99, 102, 241, 0.15);
    transform: translateY(-2px);
  }
`;

const EndpointHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(to right, #fafbff, #ffffff);
  border-bottom: 2px solid #e0e7ff;
`;

const Method = styled.span<{ method: string }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  margin-right: 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  ${({ method }) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'background-color: #e0e7ff; color: #4f46e5; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);';
      case 'POST':
        return 'background-color: #dcfce7; color: #16a34a; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);';
      case 'PUT':
        return 'background-color: #fff7ed; color: #ea580c; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.15);';
      case 'DELETE':
        return 'background-color: #fee2e2; color: #dc2626; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);';
      default:
        return 'background-color: #f3f4f6; color: #4b5563; box-shadow: 0 2px 8px rgba(75, 85, 99, 0.15);';
    }
  }}

  &:hover {
    transform: translateY(-1px);
  }
`;

const Path = styled.span`
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  color: #4f46e5;
  padding: 0.5rem 0.75rem;
  background: #f8faff;
  border-radius: 4px;
  border: 1px solid #e0e7ff;
`;

const ParameterSection = styled.div`
  padding: 1.5rem;
  background: linear-gradient(to right, #fafbff, #ffffff);
`;

const ParameterTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e7ff;
  }

  th {
    background: linear-gradient(135deg, #6366f1 0%, #1a73e8 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.025em;
  }

  tr:hover {
    background-color: #f8faff;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const CreatedDate = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: #f8faff;
  border-radius: 4px;
  border: 1px solid #e0e7ff;
  display: inline-block;
`;

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInvited, setIsInvited] = useState(false);
  const userId = sessionStorage.getItem("userId") || "";

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await Axiosbase.get(`/api/document/read/${id}`);
        setDocument(response.data);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("문서를 불러오는데 실패했습니다.");
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
// ✅ 초대 여부 확인
useEffect(() => {
  const checkInvitationStatus = async () => {
    try {
      const response = await Axiosbase.post(`/api/project/read/${document?.projectId}/invitations`, {
        params: { userId },
      });

      if (response.status === 200) {
        setIsInvited(response.data.isInvited ?? false);
      } else {
        setIsInvited(false);
      }
    } catch (err) {
      console.error("초대 여부 확인 실패:", err);
      setIsInvited(false);
    }
  };

  if (document) {
    checkInvitationStatus();
  }
}, [document, userId]);

// ✅ 문서 데이터를 조건에 맞게 표시 (초대된 경우 공유, 초대되지 않은 경우 개별)
const displayedDocument = isInvited ? document : { ...document, endpoints: [...(document?.endpoints || [])] };

if (loading) return <div>로딩중...</div>;
if (error) return <div>{error}</div>;
if (!displayedDocument) return <div>문서를 찾을 수 없습니다.</div>;
  return (
    <Container>
      <Header>
        <div>
          <Title>API 문서 상세</Title>
          <CreatedDate>
            작성일: {document?.date ? new Date(document.date).toLocaleDateString() : "N/A"}
          </CreatedDate>
        </div>
        <ButtonGroup>

          <Button className="back" onClick={handleBack}>뒤로</Button>
        </ButtonGroup>
      </Header>

      {displayedDocument.endpoints.map((endpoint, index) => (
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
