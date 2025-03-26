// 动态图标组件
const DynamicIcon = ({
  iconName,
  isSelected,
  size = 20,
  margin = "0 8px 0 0"
}: {
  iconName: string;
  isSelected: boolean;
  size?: number;
  margin?: string;
}) => {
  // 根据状态拼接图片路径
  const iconPath = `/images/icons/${iconName}${isSelected ? "@select" : ""}.png`;

  return (
    <img
      src={iconPath}
      alt="menu-icon"
      style={{
        width: size,
        height: size,
        margin,
      }}
    />
  );
};

export default DynamicIcon;
