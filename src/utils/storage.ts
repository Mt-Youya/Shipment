import Cookies from "js-cookie";
import { isJSON } from "./is.ts";

export const Local = {
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val));
  },
  get(key) {
    const json = window.localStorage.getItem(key);
    if (!isJSON(json)) return json;
    return JSON.parse(json!);
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
  clear() {
    window.localStorage.clear();
  }
};

export const Session = {
  set(key, val) {
    if (key === "token") return Cookies.set(key, val);
    window.sessionStorage.setItem(key, JSON.stringify(val));
  },
  get(key) {
    if (key === "token") return Cookies.get(key);
    const json = window.sessionStorage.getItem(key);
    if (!isJSON(json)) return json;
    return JSON.parse(json!);
  },
  remove(key) {
    if (key === "token") return Cookies.remove(key);
    window.sessionStorage.removeItem(key);
  },
  clear() {
    Cookies.remove("token");
    window.sessionStorage.clear();
  }
};

export function hasToken() {
  return Session.get("token") ?? Local.get("token");
}
