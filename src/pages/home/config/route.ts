import { IRouteItem } from "./route.type";

const routes: Partial<IRouteItem>[] = [
  {
    key: "home",
    label: "HOME",
    icon: "home",
    path: "/home",
    component: "home/index",
    showInMenu: true
  },
  {
    key: "booking",
    label: "SHIPMENT",
    icon: "booking",
    path: "/booking",
    component: "booking/index",
    showInMenu: true
  },
  {
    key: "/booking/detail",
    label: "/booking/detail",
    path: "/booking/detail",
    component: "booking/detail",
    showInMenu: false
  },
  {
    key: "/booking/upload",
    label: "/booking/upload",
    path: "/booking/upload",
    component: "booking/upload",
    showInMenu: false
  },
  {
    key: "shipment",
    label: "SHIPMENT",
    icon: "shipment",
    path: "/shipment",
    component: "shipment/index",
    showInMenu: true
  },
  {
    key: "shipment-detail",
    path: "/shipment/detail",
    activePath: "/shipment",
    component: "shipment/detail",
    showInMenu: false
  },
  // {
  //   key: "shipping-instruction",
  //   label: "SHIPPING INSTRUCTION",
  //   icon: "warning",
  //   path: "/shipping-instruction",
  //   component: "shipping-instruction/index",
  //   showInMenu: true
  // },
  {
    key: "billing",
    label: "BILLING",
    icon: "billing",
    path: "/billing",
    component: "billing/index",
    showInMenu: true
  },
  {
    key: "business",
    label: "BUSINESS",
    path: "/business",
    icon: "business",
    showInMenu: true,
    children: [
      {
        key: "business-tasks",
        label: "TASKS",
        path: "/business/tasks",
        activePath: "/business",
        component: "business/tasks/index",
        showInMenu: true
      },
      {
        key: "business-files",
        label: "FILES",
        path: "/business/files",
        activePath: "/business",
        component: "business/files/index",
        showInMenu: true
      },
      {
        key: "business-settings",
        label: "SETTINGS",
        path: "/business/settings",
        activePath: "/business",
        component: "business/settings/index",
        showInMenu: true
      }
    ]
  }
];
export default routes;
