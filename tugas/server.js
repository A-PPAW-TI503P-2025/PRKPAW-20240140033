const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const data = require("./routes/books");

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/books", data);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Tampilkan detail error di console server
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
