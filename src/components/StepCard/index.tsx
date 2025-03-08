import { Popover, Steps } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { getShipments } from "../../service/shipments";

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
  data: Awaited<ReturnType<typeof getShipments>>["list"][number];
}

function StepCard({ stepsCurrent = 1, onClick, data }: IStepCardProps) {
  const stepItems = [
    {
      title: data?.departure_location,
      description: (
        <>
          <p className="font-bold">{data?.crd}</p>
          <span>{data?.pick_up_date || "February 28, 2024 CST"}</span>
        </>
      )
    },
    {
      title: data?.departure_port,
      description: (
        <>
          <p className="font-bold">{data?.departure_date}</p>
          <span>February 28, 2024 CST</span>
        </>
      )
    },
    {
      title: "ABC2",
      description: (
        <>
          <p className="">ABC</p>
          <span>February 28, 2024 CST</span>
        </>
      )
    }
  ];

  return (
    <div
      className="flex h-16 cursor-pointer hover:bg-[#eff5ff85] transition-colors py-1 px-2"
      style={{ borderTop: "1px solid #f1f1f1" }}
      onClick={onClick}
    >
      <div className="flex-2 items-start flex justify-between flex-col">
        <h2 className="h-5 my-0 text-lg">{data?.title}</h2>
        <ul className="list-none m-0 p-0 flex flex-col gap-1 *:flex">
          <li>
            <FileTextOutlined /> &nbsp; {data?.id}
          </li>
          <li>
            <img src="/images/icons/Address.svg" alt="Address" />
            &nbsp;PO:{data?.po_order}
          </li>
          <li>
            <img src="/images/icons/Container.svg" alt="Container" />
            &nbsp;{data?.task_count}tasks | {data?.container}container
          </li>
        </ul>
      </div>
      <div className="flex-7 items-start flex justify-between flex-col">
        <h2 className="h-4 my-0 text-lg">{data?.order_progress}</h2>
        <Steps current={stepsCurrent} items={stepItems} progressDot={CustomDot} />
      </div>
    </div>
  );
}

export default StepCard;
