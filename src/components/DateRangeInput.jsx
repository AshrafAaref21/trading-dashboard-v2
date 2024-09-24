import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";

function DateRangeInput() {
  return (
    <RangePicker
      style={{ width: "60%" }}
      format={dateFormat}
      defaultValue={[dayjs().subtract(2, "week"), dayjs()]}
    />
  );
}

export default DateRangeInput;
