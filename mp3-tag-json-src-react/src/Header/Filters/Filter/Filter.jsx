import Select, { Option } from "rc-select";
import "rc-select/assets/index.css";

import styles from "./Filter.module.css";

export function Filter(props) {
  return (
    <div className={styles.customSelect}>
      <Select
        defaultValue="apple"
        showSearch
        style={{ width: 200 }}
        dropdownClassName={styles.customDropdown}
        placeholder="Select a fruit or vegetable"
        // className={styles.rcSelectControl}
      >
        <Option value="apple">🍎 Apple</Option>
        <Option value="banana">🍌 Banana</Option>
        <Option value="carrot">🥕 Carrot</Option>
        <Option value="broccoli">🥦 Broccoli</Option>
      </Select>
    </div>
  );
}
