// import { CopyrightOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText
} from "@ant-design/pro-components";
import { Form, Image, message, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import useRouteStore from "../store/route";
import useCurrentUserStore from "../store/current-user";
import { Local, Session } from "../utils/storage.ts";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [login, refreshUser] = useCurrentUserStore((state: { login: any; refreshUser: any }) => [
    state.login,
    state.refreshUser
  ]);
  // console.log(login, refreshUser);

  const onFinish = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      await login(formData);
      // const routes = await initRoutes();
      // if (!routes || routes.length === 0) {
      //   message.warning("尚未分配权限，请联系管理员先分配权限！");
      //   setLoading(false);
      //   return;
      // }
      // await refreshUser();
      setTimeout(() => {
        message.success("登录成功！");
        // const home = setFirstPath();
        navigate("/home", {
          replace: true
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = `登录`;
    const token = Session.get("token") ?? Local.get("token");
    if (!token) return;
    navigate("/home", { replace: true });
  }, []);

  return (
    <ProConfigProvider hashed={false}>
      <div
        className="flex flex-col justify-center h-full"
        style={{
          backgroundColor: token.colorBgContainer,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/images/login-bg.svg)"
        }}
      >
        <LoginForm
          logo={<Image width={144} height={108} preview={false} src="/images/login-logo.png" />}
          // title={config.title}
          submitter={{ searchConfig: { submitText: "LOGIN" } }}
          className="justify-center bg-white px-1"
          loading={loading}
          onFinish={onFinish}
          form={form}
        >
          <div className="text-center text-5xl text-black-dark opacity-90 font-bold mb-4 leading-5xl">
            {t("user.signIn")}
          </div>
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: (
                <Image
                  className="flex"
                  width={16}
                  height={16}
                  preview={false}
                  src="/images/icons/user.svg"
                />
              )
            }}
            placeholder={t('user.account')}
            rules={[
              {
                required: true,
                message: t('common.please typing') + t('user.account') //"请输入用户名!"
              }
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: (
                <Image
                  className="flex"
                  width={16}
                  height={16}
                  preview={false}
                  src="/images/icons/lock-on.svg"
                />
              )
            }}
            placeholder={t('user.password')}
            rules={[
              {
                required: true,
                message: t('common.please typing') + t('user.password') //"请输入密码!"
              }
            ]}
          />

          <div
            style={{
              marginBlockEnd: 24
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              {t("user.autoLogin")}
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
