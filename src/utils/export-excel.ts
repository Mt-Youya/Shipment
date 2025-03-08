import { cloneDeep } from "lodash";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

type TProps = {
  data: Array<any>;
  fileName: string;
};
export const exportExcel = ({ data, fileName }: TProps) => {
  const exportData = cloneDeep(data);
  const ws = utils.json_to_sheet(exportData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    `${fileName}_${new Date().getTime().toString()}` + ".xlsx"
  );
};
