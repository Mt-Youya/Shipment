import { useMemo } from "react";
import { ShipmentsStore } from "../../store/shipments.ts";
import VerticalSlider from "../../components/VerticalSlider";
import ShippingInfo from "../../components/ShippingInfo";
import formatDateTime from "../../utils/formatDateTime.ts";

import type { IShipmentMap } from "../../service/shipments/shipment.type.ts";

function DetailOrder() {
  const { mapData } = ShipmentsStore();
  const { time } = (mapData ?? {}) as IShipmentMap;
  const { depart, pol_port, transit_port, pod_port, delivery } =
    (mapData as IShipmentMap)?.places ?? {};
  function geStatusProgress(current: keyof IShipmentMap["places"]) {
    // 1:"等待到达起运港"  0.5
    // 2:"到达起运港"     1
    // 3:"船开ETD"       1
    // 4:"船开ATD"       1
    // 5:"船舶到港ETA"    1
    // 6:"船舶到港ATA"    2
    // 7:"尾端派送"       2.5
    // 8:"已送达"         3

    const status = mapData?.status;
    if (current === "depart") {
      if (status === 1) {
        return {
          isMain: true,
          percent: 0.5
        };
      }
      return { isMain: false };
    } else if (current === "pol_port") {
      if (status === 2 || status === 2) {
        return {
          isMain: true,
          percent: 1
        };
      }
      return { isMain: false };
    } else if (current === "transit_port") {
      if (status === 3 || status === 4) {
        return {
          isMain: true,
          percent: 1
        };
      }
      return { isMain: false };
    } else if (current === "pod_port") {
      if (status === 5) {
        return {
          isMain: true,
          percent: 1
        };
      }
      return { isMain: false };
    } else if (current === "delivery") {
      if (status === 6) {
        return {
          isMain: true,
          percent: 2
        };
      } else if (status === 7) {
        return {
          isMain: true,
          percent: 2.5
        };
      } else if (status === 8) {
        return {
          isMain: true,
          percent: 3
        };
      }

      return { isMain: false };
    }
    return { isMain: false };
  }

  const sliders = useMemo(() => {
    const options = [
      { ...geStatusProgress("depart"), ...useSliderDescription(depart, "depart") },
      { ...geStatusProgress("pol_port"), ...useSliderDescription(pol_port, "pol_port") },
      { ...geStatusProgress("pod_port"), ...useSliderDescription(pod_port, "pod_port") },
      {
        ...geStatusProgress("delivery"),
        showBar: false,
        description: delivery?.name,
        content: <p className="mb-4">{delivery?.address}</p>
      }
    ];
    if (transit_port) {
      options.splice(2, 0, {
        ...geStatusProgress("transit_port"),
        ...useSliderDescription(transit_port, "transit_port")
      });
    }
    return options;
  }, [depart, pol_port, pod_port, transit_port, delivery]);

  return (
    <div>
      <div>
        <h2 className="text-[#69686D] font-normal">{time?.time_type?.toUpperCase()}</h2>
        <p className="font-bold text-2xl mb-0.5">{formatDateTime(time?.time_value)}</p>
        <span>{formatDateTime(time?.created_at)}</span>
      </div>
      <div
        className="w-full h-30 mt-2 mb-3 overflow-hidden"
        style={{ borderTopRightRadius: ".5rem", borderTopLeftRadius: ".5rem" }}
      >
        <iframe className="w-full h-full border-none" src={mapData?.url} />
      </div>
      <VerticalSlider items={sliders} />
    </div>
  );
}

function useSliderDescription(data, optionName) {
  return {
    description: (
      <div>
        <h3 className="mb-1 mt-0 font-medium text-base">{data?.name}</h3>
        <p className="text-[#A3A3A3]">{data?.address || formatDateTime(data?.cutoff)}</p>
      </div>
    ),
    content: <ShippingInfo data={data} optionName={optionName} />
  };
}

export default DetailOrder;
