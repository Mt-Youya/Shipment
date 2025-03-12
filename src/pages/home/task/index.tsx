import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import useDetailList from "../../booking/detailList";
import dayjs from "dayjs";

const index: React.FC<{ data: any }> = (props) => {
  const { drop } = useDetailList();
  const { data } = props;

  return (
    <>
      {data?.list.length > 0 &&
        data.list.map((item: any, index: any) => {
          return (
            <div className={styles.RT_item} key={index}>
              <div className={styles.RT_itemone}>{item.title}</div>

              {item.po_list.length > 0 &&
                item.po_list.map((e) => (
                  <span
                    className={styles.RT_itemtwo}
                    style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                  >
                    {e}
                  </span>
                ))}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <img src="images/Group20.png" alt="" />
                  {item.task_type === 1 && "Upload Commercial Invoice & Packing List"}
                  {item.task_type === 2 && "Cargo Release Request Handling"}
                  {item.task_type === 3 && "Make Payment"}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src="images/time.png" alt="" />
                  DUE:{dayjs(new Date(item.deadline)).format("MMMDD")}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default index;
