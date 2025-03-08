import { ShipmentsStore } from "../../store/shipments.ts";
import VerticalSlider from "../../components/VerticalSlider";
import ShippingInfo from "../../components/ShippingInfo";

import type { IShipmentMap } from "../../service/shipments/shipment.type.ts";
import { useMemo } from "react";

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
    // 5:"船舶到港ETA"    1.5
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
          percent: 1.5
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
        <h2>{time?.time_type}</h2>
        <p>{time?.time_value}</p>
        <span>{time?.created_at}</span>
      </div>
      <div className="w-full h-30 my-2">
        <iframe className="w-full h-full" src={mapData?.url} />
      </div>
      <VerticalSlider items={sliders} />
    </div>
  );
}

function useSliderDescription(data, optionName) {
  return {
    description: (
      <div>
        <h3 className="mb-1 mt-0">{data?.name}</h3>
        <p className="text-[#A3A3A3]">{data?.address}</p>
      </div>
    ),
    content: <ShippingInfo data={data} optionName={optionName} />
  };
}

export default DetailOrder;
