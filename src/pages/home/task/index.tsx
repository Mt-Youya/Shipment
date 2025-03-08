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
          if (index < 3) {
            return (
              <div className={styles.RT_item} key={index}>
                <div className={styles.RT_itemone}>{item.title}</div>
                <span className={styles.RT_itemtwo}>Po:{item.po_list.join(",")}</span>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <img src="images/Group20.png" alt="" />
                    {item.task_type === 1 && "Upload Commercial Invoice & Packing List"}
                    {item.task_type === 2 && "Release"}
                    {item.task_type === 3 && "Make Payment"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="images/time.png" alt="" />
                    {dayjs(new Date(item.deadline)).format("YYYY-MM-DD HH:mm")}
                  </div>
                </div>
              </div>
            );
          }
        })}
    </>
  );
};

export default index;
