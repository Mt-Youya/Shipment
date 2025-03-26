import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IRouteItem } from "../config/route.type";
import routes from "../config/route";
import { hasToken } from "../utils/storage.ts";

interface RouteState {
  activePath: string;

  homePath: string;

  allRoutes: IRouteItem[];

  allMenus: IRouteItem[];

  init: () => void;

  getNavigatePath: (key: string) => string;
}

const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      activePath: "",
      homePath: hasToken() ? "/home" : "/login",
      allMenus: [],
      allRoutes: [],
      init: () => {
        const routeList: IRouteItem[] = [];
        const menuList: IRouteItem[] = [];
        routes.forEach((r) => {
          // 路由
          if (!r.children || r.children.length === 0) {
            routeList.push(r as IRouteItem);
          } else {
            routeList.push(...(r.children as IRouteItem[]));
          }
          // 导航菜单
          if (r.showInMenu) {
            if (r.children && r.children.length > 0) {
              r.children = r.children
                .filter((a) => a.showInMenu)
                .map((a) => {
                  const { showInMenu, activePath, ...left } = a;
                  return left;
                });
            }
            const { showInMenu, ...others } = r;
            menuList.push(others as IRouteItem);
          }
        });
        set({
          allMenus: menuList,
          allRoutes: routeList,
          homePath: hasToken() ? "/home" : "/login"
        });
      },
      getNavigatePath: (key: string) => {
        const routes = get().allRoutes;
        const currentRoute = routes.find((a) => a.key === key);
        if (currentRoute) {
          set({ activePath: currentRoute.activePath || currentRoute.path });
          return currentRoute.path;
        }
        return "";
      },
      reset: () => set({ activePath: "" })
    }),
    { name: "route" }
  )
);

export default useRouteStore;
