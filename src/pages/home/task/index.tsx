import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const index: React.FC<{ data: any }> = (props) => {
  const navigator = useNavigate();
  const { data } = props;

  return (
    <>
      {data?.list.length > 0 &&
        data.list.map((item: any, index: any) => {
          if (index < 9) {
            return (
              <div
                className={styles.RT_item}
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => navigator("/shipment/detail/" + item?.sea_order_id)}
              >
                <div className={styles.RT_itemone}>{item.title}</div>
                {item.po_list.length > 0 &&
                    item.po_list.map((e) => (
                      <span
                        className={styles.RT_itemtwo}
                        style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                      >
                        {e.split("\n").map((item, index) => (
                          <div key={index}>PO: {item}</div>
                        ))}
                      </span>
                    ))}

                <div style={{ display: "flex", justifyContent: "space-between", color: "#A3A3A3" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "5px"
                    }}
                  >
                    <img src="images/Group20.png" alt="" style={{ width: "16px" }} />
                    &nbsp;
                    {item.task_type === 1 && "Upload Commercial Invoice & Packing List"}
                    {item.task_type === 2 && "Cargo Release Request Handling"}
                    {item.task_type === 3 && "Make Payment"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* <img src="images/time.png" alt="" style={{ width: "16px" }} />
                    &nbsp; DUE:{dayjs(new Date(item.deadline)).format("MMMDD")} */}
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
