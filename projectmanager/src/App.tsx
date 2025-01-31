import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./component/AuthContext.tsx";
import Login from "./component/Login.tsx";
import Signup from "./component/Signup.tsx";
import Project from "./component/Project/Project.tsx";
import CreateProject from "./component/Project/CreateProject.tsx";
import ProjectDetail from "./component/Project/ProjectDetail.tsx";
import CreateDocument from "./component/Document/CreateDocument.tsx";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/project" element={<Project />} />
            <Route path="/createproject" element={<CreateProject />} />
            <Route path="/projectdetail/:id" element={<ProjectDetail />} />
            <Route
              path="/document/create/:id"
              element={<CreateDocument />}
            />{" "}
            {/* 경로 수정 */}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
