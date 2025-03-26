import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LangStore = create(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang })
    }),
    { name: "language" }
  )
);
