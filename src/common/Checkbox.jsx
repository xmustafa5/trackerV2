import { useState } from "react";
import "./checkbox.css";
function Checkbox({completed}) {
  const [check, setCheck] = useState(false);
  function toggleClick() {
    setCheck((prev) => !prev);
  }
  return (
    <div
      className={`checkbox ${completed && "active-checkbox"}`}
      onClick={toggleClick}
    ></div>
  );
}

export default Checkbox;
