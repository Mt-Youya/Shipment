// 定义每个节点数据的结构
import React, { useMemo } from "react";

interface NodeItem {
  content: React.ReactNode;
  isMain?: boolean;
  description?: string | React.ReactNode;
  percent?: number;
  showBar?: boolean;
}

interface IProps {
  items: NodeItem[];
}

function FourNodeSlider({ items }: IProps) {
  if (!items) return null;

  const list = useMemo(() => items.slice(0, items.length - 1), [items]);
  const lastItem = useMemo(() => items.at(-1)!, [items]);
  const mainIndex = useMemo(() => items.findIndex((item) => item.isMain), [items]);

  return (
    <div className="max-w-[1000px] min-w-45">
      <div className="relative flex flex-col border border-gray-200 mb-1 rounded-b-1">
        <div className="absolute w-1 h-full bg-[#D9D9D9] left-0.5 z-10 rounded-lg" />
        {list.map(({ showBar = true, ...item }, idx) => (
          <div
            key={idx}
            className="relative flex-col flex items-start left-0.5 z-20 pl-2 -mt-0.5 w-full"
          >
            <div className="w-full">
              <div className="mb-1 text-base">{item.description}</div>
              <div className={`flex-1 mb-2 text-xs`}>{item.content}</div>
            </div>
            <div className="absolute left-0 w-fit min-w-1 h-full">
              <div className="flex justify-center absolute">
                {item.isMain}
                {item.isMain ? (
                  <div className="relative z-40 w-2 h-2 rounded-full right-0.5 bg-[#566AE5] flex items-center justify-center shadow-md">
                    <ArrowDown />
                  </div>
                ) : (
                  <div className="relative z-10 w-1 h-1 rounded-full bg-white border-2 border-blue-500 shadow" />
                )}
              </div>
              {idx <= mainIndex - 1 && (
                <div
                  className={`absolute left-0 bg-[#566AE5] w-1 h-[calc(${100 * ((item.percent || 1) % 1)}%+2px)] ${idx === 0 && "rounded-t-2"} ${idx === items.length - 1 && "rounded-b-2"}`}
                  style={{
                    borderTopLeftRadius: idx === 0 ? "0.375rem" : "0",
                    borderTopRightRadius: idx === 0 ? "0.375rem" : "0",
                    borderBottomLeftRadius: idx === items.length - 1 ? "0.375rem" : "0",
                    borderBottomRightRadius: idx === items.length - 1 ? "0.375rem" : "0",
                    height: `calc(${100 * ((item.percent || 1) % 1)}% + 2px)`
                  }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="absolute left-0.5 bottom-0 z-10 w-1 h-1 rounded-full bg-white border-2 border-blue-500 shadow" />
      </div>
      <div className="relative flex-col flex items-start left-0.5 z-20 pl-2 -mt-2">
        <div>
          {lastItem.description && <div className="mb-1 font-bold text-base">{lastItem.description}</div>}
          <div className={`flex-1 mb-1 text-xs`}>{lastItem.content}</div>
        </div>
      </div>
    </div>
  );
}

export default FourNodeSlider;

function ArrowDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      <circle cx="10" cy="10" r="9" filter="url(#dropShadow)" />
      <path
        fill="#fff"
        d="
                      M10 6
                      C10.5523 6 11 6.4477 11 7
                      V12
                      L13 10
                      C13.4 9.6 14 9.6 14.4 10
                      C14.8 10.4 14.8 11 14.4 11.4
                      L10.7 15.1
                      C10.5 15.3 10.3 15.4 10 15.4
                      C9.7 15.4 9.5 15.3 9.3 15.1
                      L5.6 11.4
                      C5.2 11 5.2 10.4 5.6 10
                      C6 9.6 6.6 9.6 7 10
                      L9 12
                      V7
                      C9 6.4477 9.4477 6 10 6
                      Z
                    "
      />
    </svg>
  );
}
