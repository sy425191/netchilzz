import "./scrollstyle.css";
const ScrollView = ({ children, name }) => {
  return (
    <div className="horigontal_scroll">
      <span className="scrollLabel">{name}</span>
      <div className="scroll_main">{children}</div>
      <span className="rightArrow"></span>
    </div>
  );
};

export default ScrollView;
