// server.js

const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  // Kirim respon dalam format JSON
  res.json({ message: "Hello from Server!" });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
