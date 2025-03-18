import "antd/dist/reset.css";
import "./main.css";
import React, { ComponentType, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/login";
import NoPermission from "./pages/no-permission";
import NotFoundPage from "./pages/not-found";
import BasicLayout from "./layouts/basic-layout";
import Auth from "./components/auth";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import useRouteStore from "./store/route";
import { getOSSClient, OssStore } from "./store/oss.js";
import { IRouteItem } from "./config/route.type";
import "./i18n";

const allPages = import.meta.glob<{ default: ComponentType<any> }>("./pages/**/*.tsx");

const lazyLoad = (moduleName: string) => {
  const Module = lazy(allPages[`./pages/${moduleName}.tsx`]);
  return <Module />;
};

const App: React.FC = () => {
  const [init, allRoutes, homePath] = useRouteStore(
    (state: { init: () => void; allRoutes: IRouteItem[]; homePath: string }) => [
      state.init,
      state.allRoutes,
      state.homePath
    ]
  );

  // const routes = useMemo(
  //   () =>
  //     originRoutes.filter(
  //       (a: { type: ERouteType; domain: ERouteDomain }) =>
  //         a.domain === ERouteDomain.DASHBOARD && a.type !== ERouteType.BUTTON
  //     ),
  //   [originRoutes]
  // );

  const { setClient } = OssStore();

  async function getClient() {
    const client = await getOSSClient();
    setClient(client);
  }

  useEffect(() => {
    init();
    getClient();
  }, []);

  return (
    <React.Suspense>
      <AnimatePresence>
        <Routes>
          <Route path="" element={<Navigate to={homePath} />} />
          <Route path="/login" element={<Login></Login>} />
          <Route
            key="layout"
            path="/"
            element={
              <Auth>
                <BasicLayout />
              </Auth>
            }
            children={allRoutes.map((r) => (
              <Route
                key={r.key}
                path={r.path}
                element={<PrivateRoute config={r}> {lazyLoad(r.component)} </PrivateRoute>}
                loader={() => {
                  document.title = r.label;
                  return r.key;
                }}
              />
            ))}
          />
          <Route path="/403" element={<NoPermission />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </React.Suspense>
  );
};

export default App;
