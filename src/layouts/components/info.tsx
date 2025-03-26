import { Image, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Local, Session } from "../../utils/storage.ts";
import DynamicIcon from "./dynamic-icon";
import useCurrentUserStore from "../../store/current-user.ts";
import { LangStore } from "../../store/lang.ts";
import useRouteStore from "../../store/route.ts";
const { confirm } = Modal;

const Info = () => {
  const { t, i18n } = useTranslation();
  const [reset] = useRouteStore((state) => [state.reset]);
  const navigate = useNavigate();

  const onLogout = () => {
    Session.clear();
    Local.clear();
    navigate("/login");
    reset();
  };

  const showPropsConfirm = () => {
    confirm({
      icon: <></>,
      width: 480,
      height: 182,
      title: "Confirm exit",
      content: (
        <span style={{ fontSize: "14px", lineHeight: "22px", color: "#666666" }}>
          Some Are you sure you want to log out of this account?
        </span>
      ),
      okText: "confirm",
      okType: "primary",
      cancelText: "Cancel",
      onOk() {
        onLogout();
      }
    });
  };

  const { setLang } = LangStore();
  const onChangeLang = () => {
    const isEn = i18n.language === "en";
    const lang = isEn ? "zh-CN" : "en";
    i18n.changeLanguage(lang);
    setLang(lang);
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
          <span className="ml-1 text-base font-medium">{t("sideBar.lang")}</span>
        </div>
        <DynamicIcon iconName="exchange" isSelected={false} size={16} margin="0" />
      </div>
      {/* <div className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-graye6 hover:bg-opacity-50">
        <div className="flex items-center">
          <DynamicIcon iconName="notice" isSelected={false} />
          <span className="ml-1 text-base font-medium">{t("sideBar.message")}</span>
        </div>
        <span className="bg-[#FF515E] text-white text-center rounded-full text-xs w-2.5 h-2.5 leading-2xl">
          9
        </span>
      </div> */}
      <div
        className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-graye6 hover:bg-opacity-50"
        onClick={showPropsConfirm}
      >
        <div className="flex items-center">
          <Image src="/images/avatar.png" width={20} height={20} preview={false} />
          <span className="ml-1.5 text-base font-medium">{user?.username}</span>
        </div>
        <DynamicIcon iconName="logout" isSelected={false} size={16} margin="0" />
      </div>
    </div>
  );
};
export default Info;
