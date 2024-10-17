import { Tooltip } from "antd";
import { useSortData } from "../hooks/useSortData";

function SortHeader({ title }) {
  const { sortDataBy } = useSortData();

  return (
    <Tooltip title={`Sort by ${title}`}>
      <span onClick={() => sortDataBy(title)} className="table-header">
        {title}
      </span>
    </Tooltip>
  );
}

export default SortHeader;
