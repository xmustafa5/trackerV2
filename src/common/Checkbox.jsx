import "./checkbox.css";
function Checkbox({ onClick, completed }) {
  
  return <div onClick={onClick} className={`checkbox ${completed && "active-checkbox"}`}></div>;
}

export default Checkbox;
