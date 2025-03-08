import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IStaff } from "../service/staff/staff.type";
import { getCurrentStaff } from "../service/staff/staff";
import { login, refreshToken } from "../service/auth/auth";
import { ILoginReq } from "../service/auth/auth.type";
import { Local, Session } from "../utils/storage.ts";
import Cookies from "js-cookie";
// import { navigateToLogin } from "../utils/navigation-service";
// import useRouteStore from "./route";

interface CurrentUserState {
  user?: IStaff;
  accessToken: string;
  refreshToken: string;
  refreshTK: () => Promise<void>;
  /**
   * 刷新当前用户信息
   * @returns
   */
  refreshUser: () => Promise<void>;
  login: (data: ILoginReq) => Promise<void>;
  logout: () => void;
}

const useCurrentUserStore = create<CurrentUserState>()(
  persist(
    (set, get) => ({
      user: undefined,
      accessToken: "",
      refreshToken: "",
      token: "",
      refreshTK: async () => {
        const res = await refreshToken(get().refreshToken);
        set({ accessToken: res.accessToken });
      },
      refreshUser: async () => {
        const userInfo = await getCurrentStaff();
        set({ user: userInfo });
      },
      login: async (data: ILoginReq) => {
        const res = await login(data);
        const token = res.token;
        set({ accessToken: token, refreshToken: token, token, user: res.user });
        Session.set("token", res.token);
        Local.set("token", res.token);
      },
      logout: () => {
        Session.clear();
        Local.clear();
        set({
          user: undefined,
          accessToken: undefined,
          rereshToken: undefined,
          token: undefined
        });
        // const clear = useRouteStore((state) => state.clear);
        // clear();
      }
    }),
    { name: "current-user" }
  )
);

export default useCurrentUserStore;
