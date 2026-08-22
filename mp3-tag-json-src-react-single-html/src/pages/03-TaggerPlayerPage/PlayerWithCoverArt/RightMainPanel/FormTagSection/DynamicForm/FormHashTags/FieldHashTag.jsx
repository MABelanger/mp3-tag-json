const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "0.5rem",
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "0.25rem",
  textTransform: "capitalize",
};

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  width: "400px", // Sized up slightly to account for typing lists of tags
  boxSizing: "border-box", // Prevents inner padding values from breaking the absolute width constraint
};

const errorStyle = {
  color: "#dc2626",
  fontSize: "0.85rem",
  marginTop: "0.25rem",
  maxWidth: "400px",
};

export function FieldHashTag(props) {
  return (
    <div key={props.name} style={fieldStyle}>
      <label style={labelStyle}>#{props.name}Allo</label>
      <input
        type="text"
        {...props.register(props.name)}
        placeholder="e.g. ambient, tech"
        style={{
          ...inputStyle,
          borderColor: props.errorMessage ? "#dc2626" : "#ccc",
        }}
      />
      {props.errorMessage && (
        <span style={errorStyle}>{props.errorMessage}</span>
      )}
    </div>
  );
}
