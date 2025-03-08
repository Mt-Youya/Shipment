import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import config from "../config/route";
import useCurrentUserStore from "../store/current-user";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [user, accessToken] = useCurrentUserStore((state) => [state.user, state.accessToken]);

  useEffect(() => {
    document.title = `404`;
    if (!user || !accessToken) {
      navigate("/login");
    }
  }, []);

  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，您访问的页面不存在！"
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
}
