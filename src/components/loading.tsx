import ReactDOM from "react-dom";
import { Spin } from "antd";

// 全局加载 loading
let reqCount = 0;

// 显示 loading
function show() {
  if (reqCount === 0) {
    const dom = document.createElement("div");
    dom.id = "loading";
    dom.style.position = "fixed";
    dom.style.top = "0";
    dom.style.right = "0";
    dom.style.bottom = "0";
    dom.style.left = "0";
    dom.style.background = "rgba(0, 0, 0, 0.5)";
    dom.style.display = "flex";
    dom.style.justifyContent = "center";
    dom.style.alignItems = "center";
    dom.style.zIndex = "9999";
    document.body.appendChild(dom);
    ReactDOM.createRoot(dom).render(<Spin size="large"></Spin>);
  }
  reqCount++;
}

// 隐藏 loading
function hide() {
  reqCount--;
  if (reqCount === 0) {
    const dom = document.getElementById("loading");
    if (dom) {
      document.body.removeChild(dom as HTMLElement);
    }
  }
}

const fullLoading = {
  show,
  hide
};

export default fullLoading;
