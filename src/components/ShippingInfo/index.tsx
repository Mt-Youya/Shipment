import { Fragment, useMemo } from "react";
import { Divider, Popover } from "antd";
import { ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
import formatDateTime from "../../utils/formatDateTime.ts";

import type { ActionTime, IShipmentMap } from "../../service/shipments/shipment.type.ts";
import { useTranslation } from "react-i18next";

type TPlaces = IShipmentMap["places"];
interface IOption {
  label: string;
  value?: string;
  children?: ActionTime[];
}
interface IProps {
  data: TPlaces["depart"] & TPlaces["pod_port"] & TPlaces["transit_port"] & TPlaces["pol_port"];
  options?: IOption[];
  optionName: Exclude<keyof TPlaces, "delivery">;
}

function ShippingInfo({ data, optionName }: IProps) {
  const { carrier, vessel, tracking, container_info } = data ?? {};
  const { t } = useTranslation();

  const departOptions: IOption[] = [
    { label: t("shipment.crd"), value: container_info?.[0]?.crd?.time_value },
    {
      label: t("shipment.departed"),
      value: container_info?.[0]?.depart?.find(({ is_newest }) => is_newest === 1)?.time_value,
      children: container_info?.[0]?.depart
    },
    {
      label: t("shipment.arrived"),
      value: container_info?.[0]?.arrive?.find(({ is_newest }) => is_newest === 1)?.time_value,
      children: container_info?.[0]?.arrive
    }
  ];

  const portCommon: IOption[] = [
    { label: t("shipment.vessel"), value: vessel },
    { label: t("shipment.carrier"), value: carrier }
  ];

  const portOptions = [
    {
      label: t("shipment.Est. Departure"),
      value: data?.depart?.find(({ is_newest }) => is_newest === 1)?.time_value,
      children: data?.depart
    },
    {
      label: t("shipment.Est. Arrival"),
      value: data?.arrive?.find(({ is_newest }) => is_newest === 1)?.time_value,
      children: data?.arrive
    },
    ...portCommon,
    { label: t("shipment.tracking"), value: tracking }
  ];

  const podOptions: IOption[] = [
    {
      label: t("shipment.departed"),
      value: container_info?.[0]?.depart?.find(({ is_newest }) => is_newest === 1)?.time_value,
      children: container_info?.[0]?.depart
    },
    ...portCommon
  ];

  return (
    <div className="bg-[#566AE50D] p-2 rounded-lg shadow-md mix-w-4xl mx-auto w-full">
      <div className="flex gap-1">
        <div className="w-4.5 h-4.5 rounded-sm bg-[#566AE51A] flex justify-center items-center">
          <img src="/images/icons/Car.svg" alt="car" />
        </div>
        <div className="mb-1">
          <h1 className="text-xl font-bold text-gray-800 mt-0 mb-0.5">{data?.transfer_type}</h1>
          <div className="text-[#A3A3A3]">{data?.expect_time}</div>
        </div>
      </div>
      <Divider className="my-1" />

      {(optionName === "depart" || optionName === "pod_port") &&
        container_info?.map(({ container_no, transfer_info }, idx) => (
          <Fragment key={idx}>
            <BoxNumber number={container_no} />
            <div className="flex gap-0.5">
              <img src="/images/icons/Ship.svg" alt="ship" />
              <p className="text-sm font-semibold text-primary">{transfer_info}</p>
            </div>
            <br />
            <TransferList options={optionName === "depart" ? departOptions : podOptions} />
            {idx < container_info?.length - 1 && <Divider className="my-1" />}
          </Fragment>
        ))}

      {(optionName === "transit_port" || optionName === "pol_port") && (
        <>
          <BoxNumber number={carrier} />
          <div className="flex gap-0.5">
            <img src="/images/icons/Ship.svg" alt="ship" />
            <p className="text-lg font-semibold text-primary">{data?.transfer_info}</p>
          </div>
          <br />
          <TransferList options={portOptions} />
        </>
      )}
    </div>
  );
}

export default ShippingInfo;

function BoxNumber({ number }: { number: string[] }) {
  return (
    <div className="flex items-start mb-1 gap-0.5">
      <FileTextOutlined style={{ color: "#566AE5" }} />
      <ul className="m-0 -mt-[2px] p-0 grid grid-cols-2 gap-1 font-medium list-none text-sm">
        {(Array.isArray(number) ? number : [number]).map((num, index) => (
          <li key={index} className="text-primary">
            <span className="tracking-wider">{num}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TransferList({ options }: { options: IOption[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 max-w-40">
      {options?.map(({ label, value, children }, index) => (
        <div
          key={index}
          className="flex flex-col pr-1"
          style={{ borderRight: index % 3 !== 2 ? "1px solid #f1f1f1" : "none" }}
        >
          <span className="text-sm text-[#A3A3A3] mb-0.5">{label}</span>
          {children && children?.length >= 2 ? (
            <Popover content={<TransferPopper data={children} />} title="Latest Update">
              <span className="text-xs font-semibold text-[#171629] underline">
                {formatDateTime(value)}
              </span>
            </Popover>
          ) : (
            <span className="text-xs font-semibold text-[#171629]">{formatDateTime(value)}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TransferPopper({ data }: { data: ActionTime[] }) {
  const list = useMemo(() => data.slice(0, data.length - 2), [data]);
  return (
    <ul className="list-none mt-0 p-0">
      {list.map((item, index, array) => (
        <>
          <li key={index} className="flex flex-col gap-1">
            <div className="flex">
              <div className="flex flex-col">
                <span className="text-[#A3A3A3]"> Sched. Departure </span>
                <span className="line-through">{formatDateTime(array[index + 1]?.time_value)}</span>
              </div>
              <ArrowRightOutlined className="mx-2" />
              <div className="flex flex-col">
                <span className="text-[#A3A3A3]"> Departed</span>
                <span className="underline">{formatDateTime(item?.time_value)} </span>
              </div>
            </div>
            <span>{item.created_at}</span>
          </li>
          {index !== array.length - 1 && <Divider />}
        </>
      ))}
    </ul>
  );
}
