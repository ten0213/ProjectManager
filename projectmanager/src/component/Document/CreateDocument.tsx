import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Axiosbase from "../../Axiosbase.tsx";

interface DocumentRequest {
  date: string;
  projectId: number;
  endpoints: EndpointRequest[];
  creator: string;  // 작성자 필드 추가
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
  background: linear-gradient(135deg, #f6f8ff 0%, #f0f4ff 100%);
  border-radius: 16px;
`;

const Form = styled.form`
  border-radius: 12px;
  padding: 1rem 1.5rem;  // 패딩 감소
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
  border: 1px solid #e8eeff;
  margin-top: 2rem;

  min-width: 300px;  // 최소 너비 설정
  position: relative;

`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4f46e5;
  font-weight: 600;
  transition: color 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e7ff;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafbff;

  &:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    background-color: white;
  }

  &:hover {
    border-color: #a5b4fc;
    background-color: white;
  }
`;

const EndpointContainer = styled.div`
  border: 2px solid #e0e7ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #fafbff, #ffffff);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);

  &:hover {
    border-color: #818cf8;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
    transform: translateY(-1px);
  }
`;

const ParameterContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.25rem;
  background-color: #f8faff;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
  border-left: 4px solid #818cf8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.025em;

  &.parameter-add, &.endpoint-add {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  }

  &.parameter-remove, &.endpoint-remove {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  &:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: 2px solid #e0e7ff;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #4f46e5;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  &:hover {
    background-color: #f5f7ff;
    border-color: #818cf8;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 6px;
  border-left: 4px solid #ef4444;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
`;
const CreateDocument: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [previousDocument, setPreviousDocument] =
    useState<DocumentRequest | null>(null);
    const userId = sessionStorage.getItem('userId') || '';
    const [formData, setFormData] = useState<DocumentRequest>({
      date: new Date().toISOString(),
      projectId: 0,
      creator: userId,  // 작성자 정보 추가
      endpoints: [
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
    });

  useEffect(() => {
    const fetchLastDocument = async () => {
      try {
        if (!id) {
          setError("프로젝트 ID가 필요합니다.");
          return;
        }

        const projectId = parseInt(id);
        if (isNaN(projectId)) {
          setError("유효하지 않은 프로젝트 ID입니다.");
          return;
        }

        setFormData((prev) => ({ ...prev, projectId }));

        const response = await Axiosbase.get("/api/document/read/exDocumentData");
        const previousDoc = response.data;

        if (previousDoc) {
          setPreviousDocument(previousDoc);
          setFormData((prev) => ({
            ...prev,
            endpoints: previousDoc.endpoints.map((endpoint) => ({
              path: endpoint.path || "",
              method: endpoint.method || "",
              parameters: endpoint.parameters.map((param) => ({
                annotation: param.annotation || "",
                type: param.type || "",
                data: param.data || "",
              })),
            })),
          }));
        }
      } catch {
        setPreviousDocument(null);
      }
    };

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
  const handleCancel = () => {
    navigate(`/projectdetail/${formData.projectId}`);
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

  const addParameter = (currentEndpointIndex: number) => {
    setFormData((prevFormData) => {
      const updatedEndpoints = prevFormData.endpoints.map((endpoint, index) => {
        if (index === currentEndpointIndex) {
          return {
            ...endpoint,
            parameters: [
              ...endpoint.parameters,
              { annotation: "", type: "", data: "" },
            ],
          };
        }
        return endpoint;
      });

      return {
        ...prevFormData,
        endpoints: updatedEndpoints,
      };
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.projectId) {
        setError("프로젝트 ID가 필요합니다.");
        return;
      }

      if (!userId) {
        setError("사용자 정보가 필요합니다.");
        navigate('/login');
        return;
      }

      const requestData: DocumentRequest = {
        date: formData.date,
        projectId: formData.projectId,
        creator: userId,  // 현재 로그인한 사용자 ID 포함
        endpoints: formData.endpoints.map((endpoint) => ({
          path: endpoint.path || "",
          method: endpoint.method || "",
          parameters: endpoint.parameters.map((param) => ({
            annotation: param.annotation || "",
            type: param.type || "",
            data: param.data || "",
          })),
        })),
      };

      console.log("Submitting request with projectId:", formData.projectId);
      console.log("Request Data:", JSON.stringify(requestData, null, 2));

      await Axiosbase.post("/api/document/create", requestData);
      const projectId = sessionStorage.getItem('id');
      navigate(`/projectdetail/${projectId}`);

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "API 문서 생성에 실패했습니다.");
    }
  };
  return (
    <FormContainer>
      {formData.endpoints.map((endpoint, endpointIndex) => (
        <EndpointContainer key={endpointIndex}>
          <FormGroup>
            <Label>HTTP Method</Label>
            <Input
              type="text"
              placeholder={
                previousDocument?.endpoints?.[endpointIndex]?.method ||
                endpoint.method ||
                ""
              }
              onChange={(e) =>
                handleEndpointChange(endpointIndex, "method", e.target.value)
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Path</Label>
            <Input
              type="text"
              placeholder={
                previousDocument?.endpoints?.[endpointIndex]?.path ||
                endpoint.path ||
                ""
              }
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
                  placeholder={
                    previousDocument?.endpoints?.[endpointIndex]?.parameters?.[
                      paramIndex
                    ]?.annotation ||
                    param.annotation ||
                    ""
                  }
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
                  placeholder={
                    previousDocument?.endpoints?.[endpointIndex]?.parameters?.[
                      paramIndex
                    ]?.type ||
                    param.type ||
                    ""
                  }
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
                  placeholder={
                    previousDocument?.endpoints?.[endpointIndex]?.parameters?.[
                      paramIndex
                    ]?.data ||
                    param.data ||
                    ""
                  }
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
