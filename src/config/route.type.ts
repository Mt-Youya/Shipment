export interface IRouteItem {
  key: string;
  label: string;
  icon: string;
  component: string;
  path: string;
  activePath: string;
  showInMenu: boolean;
  children: Partial<IRouteItem>[];
}
