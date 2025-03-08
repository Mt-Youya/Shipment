import { Suspense, useEffect, useMemo } from "react";
import { Layout, theme, ConfigProvider, Image, Skeleton } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import enUS from "antd/locale/en_US";
import { motion } from "framer-motion";
import { useRouteStore } from "../store";
import SideMenu from "./components/side-menu";
import DynamicIcon from "./components/dynamic-icon";
import Info from "./components/info";
import { useTranslation, withTranslation } from "react-i18next";

const { Sider, Content } = Layout;

const BasicLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const {
    token: { colorBgContainer, borderRadiusSM }
  } = theme.useToken();

  const [allMenus, activePath, getNavigatePath] = useRouteStore((state) => [
    state.allMenus,
    state.activePath,
    state.getNavigatePath
  ]);

  const menuItems = useMemo(() => {
    return allMenus.map((a) => ({
      ...a,
      label: t(`menu.${a.key}`) || a.label,
      children:
        a.children?.length > 0
          ? a.children.map((b) => ({ ...b, label: t(`menu.${b.key}`) }))
          : undefined,
      icon: <DynamicIcon iconName={a.icon} isSelected={activePath === a.path} />
    }));
  }, [activePath, allMenus]);

  const currentKey = useMemo(() => {
    return location.pathname.slice(1).replace("/", "-");
  }, [location]);

  useEffect(() => {
    getNavigatePath(currentKey);
  }, [currentKey]);

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          colorPrimary: "#566AE5",
          colorTextBase: "#171629",
          borderRadiusLG: 6,
          borderRadius: 4,
          borderRadiusSM: 3,
          size: 14,
          sizeLG: 22,
          sizeMD: 18,
          sizeMS: 14,
          sizeSM: 10,
          sizeXL: 30,
          sizeXXL: 46
        },
        components: {
          Button: {
            controlHeightLG: 48,
            controlHeight: 32,
            controlHeightSM: 24
          },
          Tabs: {
            borderRadius: 0,
            horizontalMargin: "0",
            cardBg: "#f7f7f7",
            itemColor: "#69686D",
            cardPaddingSM: "8px 16px"
          },
          Table: {
            borderRadiusLG: 0,
            headerBg: "#fff",
            headerColor: "#a5a5a5",
            cellPaddingBlock: 12
          },
          Descriptions: {
            titleColor: "#A5A5A5",
            labelBg: "#F6F6F8",
            colorSplit: "#e7e7e7",
            borderRadiusLG: 0,
            contentColor: "#171629"
          }
        }
      }}
    >
      <Layout className="h-full">
        <Sider trigger={null} width={230} className="bg-white">
          <div className="h-full flex flex-col">
            <div className="flex justify-center items-center pt-3 pb-2">
              <Image width={67} height={50} preview={false} src="/images/login-logo.png" />
              <span className="text-base font-bold relative right-1">SHUNXINDA</span>
            </div>
            <SideMenu items={menuItems} defaultKeys={[activePath.slice(1), currentKey]} />
            <Info />
          </div>
        </Sider>
        <Layout>
          <Content
            className="overflow-y-auto"
            style={{
              minHeight: 280,
              padding: "10px 0px 10px 0",
              background: colorBgContainer
            }}
          >
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                height: "100%",
                padding: "0 16px",
                borderRadius: borderRadiusSM,
                border: "1px solid rgba(206, 208, 209, 1)",
                overflow: "auto"
              }}
            >
              <Suspense fallback={<Skeleton />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default withTranslation()(BasicLayout);
