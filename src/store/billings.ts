import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BillingStore = create(
  persist(
    (set) => ({
      billingData: [],
      setBillingData: (billingData) => set({ billingData })
    }),
    { name: "billings" }
  )
);
