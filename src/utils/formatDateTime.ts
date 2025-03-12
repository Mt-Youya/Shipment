import dayjs from "dayjs";

function formatDateTime(date?: string): string | undefined {
  return dayjs(date).isValid() ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : date;
}

export default formatDateTime;
