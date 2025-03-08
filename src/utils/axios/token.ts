import useCurrentUserStore from "../../store/current-user";
import { Local, Session } from "../storage.ts";
import Cookies from "js-cookie";

export class Token {
  private static requestInstance: () => Promise<void>;

  static getToken() {
    const token =
      useCurrentUserStore.getState().accessToken ||
      Cookies.get("token") ||
      Session.get("token") ||
      Local.get("token");
    return `Bearer ${token}`;
  }

  static async refresh() {
    if (!Token.requestInstance) {
      Token.requestInstance = useCurrentUserStore.getState().refreshTK;
    }
    await Token.requestInstance();
  }

  static logout() {
    useCurrentUserStore.getState().logout();
  }
}
