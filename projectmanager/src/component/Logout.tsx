import React from "react";
import { useNavigate } from "react-router-dom";

import Axiosbase from "../Axiosbase.tsx";



const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (window.confirm("로그아웃 하시겠습니까?") === true) {
        await Axiosbase.post(
          "api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        delete Axiosbase.defaults.headers.common["Authorization"];

        // 로그인 페이지로 리다이렉트
        navigate("/");

        // 백엔드 로그아웃 API 호출
      }
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);

      // 에러가 발생하더라도 로컬의 토큰은 제거하고 로그인 페이지로 이동
      sessionStorage.removeItem("token");
      delete Axiosbase.defaults.headers.common["Authorization"];
      navigate("/");
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
