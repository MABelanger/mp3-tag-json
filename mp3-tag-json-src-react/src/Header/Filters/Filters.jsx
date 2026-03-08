import { Filter } from "./Filter";
import styles from "./Filters.module.css";

export function Filters(props) {
  return (
    <div className={styles.FilterMarginBottom}>
      <Filter />
      <Filter />
    </div>
  );
}
