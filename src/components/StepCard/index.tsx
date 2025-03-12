import { Popover, Steps } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { getShipments } from "../../service/shipments";
import styles from "./styles.module.less";

import type { AwaitedReturn } from "../../utils/common.type.ts";

function CustomDot(dot, { index, title, description }) {
  if (index === 2) {
    return (
      <Popover
        content={
          <span>
            {title}
            {description}
          </span>
        }
      >
        {dot}
      </Popover>
    );
  }
  return <>{dot} </>;
}

interface IStepCardProps {
  stepsCurrent?: number;
  onClick?: () => void;
  data: AwaitedReturn<typeof getShipments>["list"][number];
}

function StepCard({ onClick, data }: IStepCardProps) {
  const stepsCurrent = [0.5, 1, 1, 1.5, 2, 3, 4, 5][data?.status || 0];

  const stepItems = [
    {
      title: data?.departure_location,
      description: (
        <>
          <p>CRD:</p>
          <p>{data?.crd}</p>
          <span>{data?.pick_up_date}</span>
        </>
      )
    },
    {
      title: (
        <span className={`${[false, true, true][stepsCurrent] && "text-blue"}`}>
          {data?.departure_port}
        </span>
      ),
      description: (
        <>
          <p>{[false, true, true][stepsCurrent] ? "Est. Arrival" : "Arrived"}: </p>
          <span>{data?.departure_arrive}</span>
          {data?.departure_date && (
            <>
              <p>Est. Departure: </p>
              <span>{data?.departure_date}</span>
            </>
          )}
        </>
      )
    },
    {
      title: (
        <span
          className={`${[false, false, false, false, false, true][stepsCurrent] && "text-blue"}`}
        >
          The boat is sailing
        </span>
      ),
      description: (
        <>
          <p>Departed</p>
          <span>{data?.sail_departure}</span>
          <p>Est. Arrival: </p>
          <span>{data?.sail_arrive}</span>
        </>
      )
    },
    {
      title: (
        <span
          className={`${[false, false, false, false, false, false, true][stepsCurrent] && "text-blue"}`}
        >
          {data?.arrival_port}
        </span>
      ),
      description: (
        <>
          <p>Est. Pickup:</p>
          <span>{data?.arrival_pickup}</span>
        </>
      )
    },
    {
      title: (
        <span
          className={`${[false, false, false, false, false, false, false, true][stepsCurrent] && "text-blue"}`}
        >
          {data?.consignee}
        </span>
      ),
      description: (
        <>
          {data?.delivery_arrive && (
            <>
              <p>Est. Delivery:</p>
              <p>{data?.delivery_arrive}</p>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <div
      className="flex min-h-16 cursor-pointer hover:bg-[#eff5ff85] transition-colors py-1 px-2 gap-1"
      style={{ borderTop: "1px solid #f1f1f1" }}
      onClick={onClick}
    >
      <div className="flex-4 max-w-[800px] items-start flex justify-between flex-col">
        <h2 className="h-5 my-0 text-lg">{data?.title}</h2>
        <ul className="list-none m-0 p-0 flex flex-col gap-1 *:flex">
          <li>
            <FileTextOutlined /> &nbsp; {data?.order_no}
          </li>
          {!!data?.po_order?.length && (
            <li>
              <img
                width="16"
                height="16"
                className="mt-0.5 mr-0.5"
                src="/images/icons/Address.svg"
                alt="Address"
              />
              <ol className="list-none grid grid-cols-2 gap-0.5 p-0 m">
                {data?.po_order?.map((po, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: `PO: ${po}` }} />
                ))}
              </ol>
            </li>
          )}
          <li>
            <img src="/images/icons/Container.svg" alt="Container" />
            &nbsp;{data?.task_count}task{data?.task_count > 1 ? "s" : ""} | {data?.container}
            container
          </li>
        </ul>
      </div>
      <div className="flex-6 items-start flex justify-between flex-col">
        <h2 className="h-4 my-0 text-lg">{data?.order_progress}</h2>
        <Steps
          current={stepsCurrent}
          items={stepItems}
          progressDot={CustomDot}
          className={styles.stepsCard}
        />
      </div>
    </div>
  );
}

export default StepCard;
