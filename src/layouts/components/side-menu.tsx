import React from "react";
import { ConfigProvider, GetProp, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useRouteStore } from "../../store";
import styles from "../styles.module.less";

type MenuItem = GetProp<MenuProps, "items">[number];

const SideMenu: React.FC<{
  items: MenuItem[];
  defaultKeys: string[];
}> = ({ items, defaultKeys }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [getNavigatePath] = useRouteStore((state) => [state.getNavigatePath]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBorderRadius: 4,
            itemColor: "#2b2d2e",
            activeBarBorderWidth: 0,
            itemMarginInline: 20,
            itemMarginBlock: 10,
            itemHeight: 46,
            iconMarginInlineEnd: 18,
            groupTitleFontSize: 16,
            itemSelectedColor: "#566AE5",
            itemSelectedBg: "rgba(86, 106, 229, 0.1)",
            subMenuItemBg: "transparent",
            fontFamily: "SourceHanSansSC"
          }
        }
      }}
    >
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          className={styles.menu}
          defaultOpenKeys={defaultKeys}
          defaultSelectedKeys={defaultKeys}
          items={items}
          onClick={(item) => {
            if (item.key === location.pathname.slice(1)) return;
            const path = getNavigatePath(item.key);
            navigate(path);
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default SideMenu;
