import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Axiosbase from '../../Axiosbase.tsx';

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
   background-color: #4CAF50;
   color: white;
   &:hover {
     background-color: #388E3C;
   }
 }

 &.parameter-remove {
   background-color: #F44336;
   color: white;
   &:hover {
     background-color: #D32F2F;
   }
 }

 &.endpoint-add {
   background-color: #4CAF50;
   color: white;
   &:hover {
     background-color: #388E3C;
   }
 }

 &.endpoint-remove {
   background-color: #F44336;
   color: white;
   &:hover {
     background-color: #D32F2F;
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
 const [formData, setFormData] = useState<DocumentRequest>({
  date: new Date().toISOString().split('T')[0], // 하드코딩된 빈 문자열 대신 실제 날짜 사용
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
useEffect(() => {
  if (id) {
    const projectId=10;
    console.log('Current Project ID:', projectId); // 디버깅용
    setFormData(prev => ({
      ...prev,
      projectId: projectId
    }));
  } else {
    console.log('No project ID found in URL'); // 디버깅용
  }
}, [id]);

 const handleEndpointChange = (index: number, field: keyof EndpointRequest, value: string) => {
   setFormData(prev => ({
     ...prev,
     endpoints: prev.endpoints.map((endpoint, i) =>
       i === index ? { ...endpoint, [field]: value } : endpoint
     )
   }));
 };

 const handleParameterChange = (endpointIndex: number, paramIndex: number, field: keyof ParameterRequest, value: string) => {
   setFormData(prev => ({
     ...prev,
     endpoints: prev.endpoints.map((endpoint, i) =>
       i === endpointIndex ? {
         ...endpoint,
         parameters: endpoint.parameters.map((param, j) =>
           j === paramIndex ? { ...param, [field]: value } : param
         )
       } : endpoint
     )
   }));
 };

 const addEndpoint = () => {
   setFormData(prev => ({
     ...prev,
     endpoints: [...prev.endpoints, {
       path: '',
       method: '',
       parameters: [{
         annotation: '',
         type: '',
         data: ''
       }]
     }]
   }));
 };

 const addParameter = (endpointIndex: number) => {
   setFormData(prev => ({
     ...prev,
     endpoints: prev.endpoints.map((endpoint, i) =>
       i === endpointIndex ? {
         ...endpoint,
         parameters: [...endpoint.parameters, {
           annotation: '',
           type: '',
           data: ''
         }]
       } : endpoint
     )
   }));
 };

 const removeEndpoint = (index: number) => {
   if (formData.endpoints.length > 1) {
     setFormData(prev => ({
       ...prev,
       endpoints: prev.endpoints.filter((_, i) => i !== index)
     }));
   }
 };

 const removeParameter = (endpointIndex: number, paramIndex: number) => {
   if (formData.endpoints[endpointIndex].parameters.length > 1) {
     setFormData(prev => ({
       ...prev,
       endpoints: prev.endpoints.map((endpoint, i) =>
         i === endpointIndex ? {
           ...endpoint,
           parameters: endpoint.parameters.filter((_, j) => j !== paramIndex)
         } : endpoint
       )
     }));
   }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // projectId가 유효한지 먼저 확인
    if (!id) {
      setError('프로젝트 ID가 필요합니다.');
      return;
    }

    const projectId = parseInt(id, 10);
    if (isNaN(projectId) || projectId <= 0) {
      setError('유효하지 않은 프로젝트 ID입니다.');
      return;
    }

    const requestData: DocumentRequest = {
      date: new Date().toISOString().split('T')[0],
      projectId: projectId,
      endpoints: formData.endpoints.map(endpoint => ({
        path: endpoint.path || '',  // 빈 문자열 대신 null 체크
        method: endpoint.method || '',
        parameters: endpoint.parameters.map(param => ({
          annotation: param.annotation || '',
          type: param.type || '',
          data: param.data || ''
        }))
      }))
    };

    console.log('Request Data:', JSON.stringify(requestData, null, 2));

    const response = await Axiosbase.post('/api/document/create', requestData);
    console.log('Response:', response);

    navigate("/projectdetail");
  } catch (err: any) {
    console.error('Error details:', err.response?.data);
    console.error('Error status:', err.response?.status);
    console.error('Full error:', err);
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
             value={endpoint.method}
             onChange={(e) => handleEndpointChange(endpointIndex, 'method', e.target.value)}
           />
         </FormGroup>

         <FormGroup>
           <Label>Path</Label>
           <Input
             type="text"
             value={endpoint.path}
             onChange={(e) => handleEndpointChange(endpointIndex, 'path', e.target.value)}
           />
         </FormGroup>

         {endpoint.parameters.map((param, paramIndex) => (
           <ParameterContainer key={paramIndex}>
             <FormGroup>
               <Label>Annotation</Label>
               <Input
                 type="text"
                 value={param.annotation}
                 onChange={(e) => handleParameterChange(endpointIndex, paramIndex, 'annotation', e.target.value)}
               />
             </FormGroup>

             <FormGroup>
               <Label>Parameter Type</Label>
               <Input
                 type="text"
                 value={param.type}
                 onChange={(e) => handleParameterChange(endpointIndex, paramIndex, 'type', e.target.value)}
               />
             </FormGroup>

             <FormGroup>
               <Label>Parameter Data</Label>
               <Input
                 type="text"
                 value={param.data}
                 onChange={(e) => handleParameterChange(endpointIndex, paramIndex, 'data', e.target.value)}
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
       <ActionButton type="button" className="endpoint-add" onClick={addEndpoint}>
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
