import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
// import config from "../config/route";

const NoPermission: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `没有权限`;
  }, []);

  return (
    <Result
      status="403"
      title="403"
      subTitle="您没有该页面的访问权限！"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};

export default NoPermission;
