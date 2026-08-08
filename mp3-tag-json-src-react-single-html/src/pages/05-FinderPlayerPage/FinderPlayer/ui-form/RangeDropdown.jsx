export function RangeDropdown({ title, range, value, onChange, name }) {
  // Generate numbers dynamically from min to max inclusive
  const options = [];
  for (let i = range.min; i <= range.max; i++) {
    options.push(i);
  }

  return (
    <div style={{ display: "inline-block", marginRight: "10px" }}>
      {title && <label style={{ marginRight: "5px" }}>{title}:</label>}
      <select name={name} value={value} onChange={onChange}>
        <option value="">Select value</option>
        {options.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
}
