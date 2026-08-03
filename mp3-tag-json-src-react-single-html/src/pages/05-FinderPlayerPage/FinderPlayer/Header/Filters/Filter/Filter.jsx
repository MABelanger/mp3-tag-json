import Select, { Option } from "rc-select";
import "rc-select/assets/index.css";

import styles from "./Filter.module.css";

export function Filter(props) {
  return (
    <div className={styles.customSelect}>
      <label htmlFor="bpm-select" className={styles.label}>
        BPM
      </label>
      <Select
        id="bpm-select"
        showSearch
        style={{ width: "8rem" }}
        dropdownClassName={styles.customDropdown}
        placeholder="<BPM>"
        // className={styles.rcSelectControl}
      >
        <Option value="*">*</Option>
        <Option value="80-85">80-85</Option>
        <Option value="85-90">85-90</Option>
        <Option value="90-95">90-95</Option>
        <Option value="95-100">95-100</Option>
      </Select>
    </div>
  );
}
