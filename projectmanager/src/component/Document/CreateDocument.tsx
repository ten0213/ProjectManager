import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Axiosbase from "../../Axiosbase.tsx";

interface DocumentRequest {
  date: string;
  projectId: number;
  endpoints: EndpointRequest[];
  writer: string; // 작성자 필드 추가
}
interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: string;
  isInvited: boolean; // ✅ 초대 여부 필드 추가
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
  padding: 1rem 1.5rem; // 패딩 감소
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
  border: 1px solid #e8eeff;
  margin-top: 2rem;

  min-width: 300px; // 최소 너비 설정
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

  &.parameter-add,
  &.endpoint-add {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
  }

  &.parameter-remove,
  &.endpoint-remove {
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
  const { id } = useParams<{ id: string }>(); // 프로젝트 ID 가져오기
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [previousDocument, setPreviousDocument] =
    useState<DocumentRequest | null>(null);
  const userId = sessionStorage.getItem("userId") || "";
  const [isInvited] = useState(false);
  const [, setProject] = useState<Project | null>(null);


  const [formData, setFormData] = useState<DocumentRequest>({
    date: new Date().toISOString(),
    projectId: id ? parseInt(id) : 0,
    writer: userId,
    endpoints: [{ path: "", method: "", parameters: [{ annotation: "", type: "", data: "" }] }],
  });
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        console.log("📢 프로젝트 정보 가져오기...");
        const response = await Axiosbase.get(`/api/project/read/${id}`);
        setProject(response.data);

        // ✅ 초대된 경우 기존 문서를 불러오기
        if (response.data.isInvited) {
          fetchPreviousDocument();
        }
      } catch (err) {
        console.warn("⚠️ 프로젝트 정보 가져오기 실패:", err);
      }
    };

    const fetchPreviousDocument = async () => {
      try {
        console.log("📢 이전 문서 가져오기 요청 실행...");
        const response = await Axiosbase.get("/api/document/read/exDocumentData");

        if (response.data.writer === userId) {
          console.log("이전 문서 가져오기 성공:", response.data);
          setFormData((prev) => ({
            ...prev,
            endpoints: response.data.endpoints.map((endpoint) => ({
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
      } catch (err) {
        console.warn("⚠️ 이전 문서 가져오기 실패:", err);
      }
    };

    fetchProject();
  }, [id, userId]);



   // ✅ 프로젝트 ID 유효성 검사
   useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      setError("프로젝트 ID가 유효하지 않습니다.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      projectId: parseInt(id),
    }));
  }, [id]);

   // ✅ 초대 여부 확인 (API 요청)
  // ✅ 초대 여부 확인 (API 요청)


  // ✅ 기존 문서 가져오기 (초대된 경우에만 적용)
  useEffect(() => {
    if (!id || isNaN(parseInt(id))) return;

    const fetchLastDocument = async () => {
      try {
        console.log("📢 이전 문서 가져오기 요청 실행...");
        const response = await Axiosbase.get("/api/document/read/exDocumentData");
        const previousDoc = response.data;

        if (previousDoc && previousDoc.writer === userId) {
          console.log("이전 문서 가져오기 성공:", previousDoc);
          setPreviousDocument(previousDoc);
        }
      } catch (err) {
        console.warn("⚠️ 이전 문서 가져오기 실패:", err);
        setPreviousDocument(null);
      }
    };

    fetchLastDocument();
  }, [id, userId]);

  // ✅ 기존 문서 데이터 적용
  useEffect(() => {
    if (isInvited && previousDocument) {
      console.log("📢 초대된 사용자 -> 기존 문서 공유 적용");
      setFormData((prev) => ({
        ...prev,
        endpoints: previousDocument.endpoints.map((endpoint) => ({
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
  }, [isInvited, previousDocument]);


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
  // ✅ 프로젝트 정보 가져오기 (필요할 경우)
useEffect(() => {
  if (!id) return;

  const fetchProject = async () => {
    try {
      console.log("📢 프로젝트 정보 가져오기...");
      const response = await Axiosbase.get(`/api/project/read/${id}`);
      console.log("프로젝트 정보:", response.data);
    } catch (err) {
      console.warn("⚠️ 프로젝트 정보 가져오기 실패:", err);
    }
  };

  fetchProject();
}, [id]);

 // ✅ 문서 생성 요청
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!formData.projectId) {
      setError("프로젝트 ID가 필요합니다.");
      return;
    }

    if (!userId) {
      setError("사용자 정보가 필요합니다.");
      navigate("/login");
      return;
    }

    // ✅ 엔드포인트 확인 후 요청
    await Axiosbase.post("/api/document/create", formData);
    navigate(`/projectdetail/${formData.projectId}`);
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
