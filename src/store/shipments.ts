import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IShipmentMap } from "../service/shipments/shipment.type.ts";

export const ShipmentsStore = create(
  persist(
    (set) => ({
      mapData: null as null | IShipmentMap,
      setMapData: (mapData) => set(() => ({ mapData })),
      dropdownOptions: [],
      setDropdownOptions: (dropdownOptions) => set(() => ({ dropdownOptions }))
    }),
    { name: "shipments" }
  )
);
