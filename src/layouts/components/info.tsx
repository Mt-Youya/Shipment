import { Image } from "antd";
import DynamicIcon from "./dynamic-icon";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Local, Session } from "../../utils/storage.ts";
import useCurrentUserStore from "../../store/current-user.ts";

const Info = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const onLogout = () => {
    Session.clear();
    Local.clear();
    navigate("/login");
  };

  const onChangeLang = () => {
    const isEn = i18n.language === "en";
    i18n.changeLanguage(isEn ? "zh-CN" : "en");
  };

  const { user } = useCurrentUserStore();

  return (
    <div className="px-1 pb-1">
      <div
        className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-graye6 hover:bg-opacity-50"
        onClick={onChangeLang}
      >
        <div className="flex items-center justify-start">
          <DynamicIcon iconName="translation" isSelected={false} />
          <span className="ml-1 text-base font-medium">{t("info-bar.lang")}</span>
        </div>
        <DynamicIcon iconName="exchange" isSelected={false} size={16} margin="0" />
      </div>
      <div className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-graye6 hover:bg-opacity-50">
        <div className="flex items-center">
          <DynamicIcon iconName="notice" isSelected={false} />
          <span className="ml-1 text-base font-medium">{t("info-bar.message")}</span>
        </div>
        <span
          style={{
            background: "#FF515E",
            color: "#fff",
            width: "16px",
            height: "16px",
            lineHeight: "16px",
            textAlign: "center",
            borderRadius: "50%",
            fontSize: "10px"
          }}
        >
          9
        </span>
      </div>
      <div
        className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-graye6 hover:bg-opacity-50"
        onClick={onLogout}
      >
        <div className="flex items-center">
          <Image src="/images/avatar.png" width={26} height={26} preview={false} />
          <span className="ml-1 text-base font-medium">{user?.username}</span>
        </div>
        <DynamicIcon iconName="logout" isSelected={false} size={16} margin="0" />
      </div>
    </div>
  );
};
export default Info;
