function App() {
  fetch("test.txt")
    .then((response) => response.text())
    .then((data) => console.log("Success! Flag is ACTIVE:", data))
    .catch((err) => console.error("Failed! Flag is INACTIVE:", err));

  return <div>Hello</div>;
}

export default App;
