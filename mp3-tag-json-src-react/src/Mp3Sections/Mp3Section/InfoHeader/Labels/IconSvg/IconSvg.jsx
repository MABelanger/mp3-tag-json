//import ExpentionSvg from "./icon/01-expention.svg";
import ExpentionSvg from "./svg/01-expention.svg?react";

export function IconSvg(props) {
  if (props.iconName == "expention") {
    return (
      <div style={{ width: "30px" }} title="This text appears on hover">
        <ExpentionSvg />
      </div>
    );
  }
}
