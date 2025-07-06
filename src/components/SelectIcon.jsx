import { BorderOutlined, CheckCircleFilled } from "@ant-design/icons";
import "./SelectIcon.css";

const SelectIcon = ({ selected, onClick }) => {
  return (
    <>
      <button className={"select-icon"} onClick={onClick}>
        {selected ? (
          <CheckCircleFilled className={"icon"} />
        ) : (
          <BorderOutlined className={"icon"} />
        )}
      </button>
    </>
  );
};

export default SelectIcon;
