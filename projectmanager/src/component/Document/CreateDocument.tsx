import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Axiosbase from "../../Axiosbase.tsx";

interface DocumentRequest {
  date: string;
  projectId: number;
  endpoints: EndpointRequest[];
}

interface EndpointRequest {
  path: string;
  method: string;
  parameters: ParameterRequest[];
}

interface ParameterRequest {
  data: string;
  type: string;
  annotation: string;
}

const FormContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const EndpointContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ParameterContainer = styled.div`
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &.parameter-add {
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }

  &.parameter-remove {
    background-color: #f44336;
    color: white;
    &:hover {
      background-color: #d32f2f;
    }
  }

  &.endpoint-add {
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }

  &.endpoint-remove {
    background-color: #f44336;
    color: white;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem 2rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  background-color: #2196f3;
  color: white;
  &:hover {
    background-color: #1976d2;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 2rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  background-color: #f5f5f5;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const CreateDocument: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [previousDocument, setPreviousDocument] = useState<DocumentRequest | null>(null);
  // 초기 상태 수정
  const [formData, setFormData] = useState<DocumentRequest>({
    date: new Date().toISOString(),
    projectId: 0,
    endpoints: [{
      path: '',
      method: '',
      parameters: [{
        annotation: '',
        type: '',
        data: ''
      }]
    }]
  });

  // useEffect 수정
  useEffect(() => {
    if (!id) {
      console.error('No project ID in URL');
      setError('프로젝트 ID가 필요합니다.');
      return;
    }

    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      console.error('Invalid project ID:', id);
      setError('유효하지 않은 프로젝트 ID입니다.');
      return;
    }

    console.log('Setting project ID:', projectId);
    setFormData(prev => ({
      ...prev,
      projectId: projectId
    }));
  }, [id]);

  const fetchLastDocument = async () => {
    try {
      const response = await Axiosbase.get(`/api/document/read/exDocumentData`);
      setPreviousDocument(response.data);

    // 이전 문서 데이터를 formData에 설정
    if(response.data) {
      setFormData(prev => ({
        ...prev,
        endpoints: response.data.endpoints.map(endpoint => ({
          path: endpoint.path,
          method: endpoint.method,
          parameters: endpoint.parameters.map(param => ({
            annotation: param.annotation,
            type: param.type,
            data: param.data
          }))
        }))
      }));
    }
  } catch (err) {
    console.log('이전 문서가 없거나 불러오기 실패');
  }
};

  useEffect(() => {
    if (!id) {
      console.error('No project ID in URL');
      setError('프로젝트 ID가 필요합니다.');
      return;
    }

    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      console.error('Invalid project ID:', id);
      setError('유효하지 않은 프로젝트 ID입니다.');
      return;
    }

    console.log('Setting project ID:', projectId);
    setFormData(prev => ({
      ...prev,
      projectId: projectId
    }));

    // 이전 문서 데이터 불러오기
    fetchLastDocument();
  }, [id]);
  const handleEndpointChange = (
    index: number,
    field: keyof EndpointRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === index ? { ...endpoint, [field]: value } : endpoint
      ),
    }));
  };

  const handleParameterChange = (
    endpointIndex: number,
    paramIndex: number,
    field: keyof ParameterRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === endpointIndex
          ? {
              ...endpoint,
              parameters: endpoint.parameters.map((param, j) =>
                j === paramIndex ? { ...param, [field]: value } : param
              ),
            }
          : endpoint
      ),
    }));
  };

  const addEndpoint = () => {
    setFormData((prev) => ({
      ...prev,
      endpoints: [
        ...prev.endpoints,
        {
          path: "",
          method: "",
          parameters: [
            {
              annotation: "",
              type: "",
              data: "",
            },
          ],
        },
      ],
    }));
  };

  const addParameter = (endpointIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === endpointIndex
          ? {
              ...endpoint,
              parameters: [
                ...endpoint.parameters,
                {
                  annotation: "",
                  type: "",
                  data: "",
                },
              ],
            }
          : endpoint
      ),
    }));
  };

  const removeEndpoint = (index: number) => {
    if (formData.endpoints.length > 1) {
      setFormData((prev) => ({
        ...prev,
        endpoints: prev.endpoints.filter((_, i) => i !== index),
      }));
    }
  };

  const removeParameter = (endpointIndex: number, paramIndex: number) => {
    if (formData.endpoints[endpointIndex].parameters.length > 1) {
      setFormData((prev) => ({
        ...prev,
        endpoints: prev.endpoints.map((endpoint, i) =>
          i === endpointIndex
            ? {
                ...endpoint,
                parameters: endpoint.parameters.filter(
                  (_, j) => j !== paramIndex
                ),
              }
            : endpoint
        ),
      }));
    }
  };

  // handleSubmit 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.projectId) {
        setError('프로젝트 ID가 필요합니다.');
        return;
      }

      const requestData: DocumentRequest = {
        date: formData.date,
        projectId: formData.projectId,
        endpoints: formData.endpoints.map(endpoint => ({
          path: endpoint.path || '',
          method: endpoint.method || '',
          parameters: endpoint.parameters.map(param => ({
            annotation: param.annotation || '',
            type: param.type || '',
            data: param.data || ''
          }))
        }))
      };

      console.log('Submitting request with projectId:', formData.projectId);
      console.log('Request Data:', JSON.stringify(requestData, null, 2));

      const response = await Axiosbase.post('/api/document/create', requestData);
      navigate(`/projectdetail/${formData.projectId}`);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'API 문서 생성에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormContainer>
      {formData.endpoints.map((endpoint, endpointIndex) => (
  <EndpointContainer key={endpointIndex}>
    <FormGroup>
      <Label>HTTP Method</Label>
      <Input
        type="text"
        placeholder={previousDocument?.endpoints[endpointIndex]?.method || endpoint.method}
        onChange={(e) =>
          handleEndpointChange(endpointIndex, "method", e.target.value)
        }
      />
    </FormGroup>

    <FormGroup>
      <Label>Path</Label>
      <Input
        type="text"
        placeholder={previousDocument?.endpoints[endpointIndex]?.path || endpoint.path}
        onChange={(e) =>
          handleEndpointChange(endpointIndex, "path", e.target.value)
        }
      />
    </FormGroup>

    {endpoint.parameters.map((param, paramIndex) => (
      <ParameterContainer key={paramIndex}>
        <FormGroup>
          <Label>Annotation</Label>
          <Input
            type="text"
            placeholder={previousDocument?.endpoints[endpointIndex]?.parameters[paramIndex]?.annotation || param.annotation}
            onChange={(e) =>
              handleParameterChange(
                endpointIndex,
                paramIndex,
                "annotation",
                e.target.value
              )
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Parameter Type</Label>
          <Input
            type="text"
            placeholder={previousDocument?.endpoints[endpointIndex]?.parameters[paramIndex]?.type || param.type}
            onChange={(e) =>
              handleParameterChange(
                endpointIndex,
                paramIndex,
                "type",
                e.target.value
              )
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Parameter Data</Label>
          <Input
            type="text"
            placeholder={previousDocument?.endpoints[endpointIndex]?.parameters[paramIndex]?.data || param.data}
            onChange={(e) =>
              handleParameterChange(
                endpointIndex,
                paramIndex,
                "data",
                e.target.value
              )
            }
          />
        </FormGroup>

              <ActionButton
                type="button"
                className="parameter-remove"
                onClick={() => removeParameter(endpointIndex, paramIndex)}
              >
                파라미터 삭제
              </ActionButton>
            </ParameterContainer>
          ))}

          <ButtonGroup>
            <ActionButton
              type="button"
              className="parameter-add"
              onClick={() => addParameter(endpointIndex)}
            >
              파라미터 추가
            </ActionButton>
            <ActionButton
              type="button"
              className="endpoint-remove"
              onClick={() => removeEndpoint(endpointIndex)}
            >
              엔드포인트 삭제
            </ActionButton>
          </ButtonGroup>
        </EndpointContainer>
      ))}

      <ButtonGroup>
        <ActionButton
          type="button"
          className="endpoint-add"
          onClick={addEndpoint}
        >
          엔드포인트 추가
        </ActionButton>
      </ButtonGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <ButtonGroup>
          <SubmitButton type="submit">생성</SubmitButton>
          <CancelButton type="button" onClick={handleCancel}>
            취소
          </CancelButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default CreateDocument;
