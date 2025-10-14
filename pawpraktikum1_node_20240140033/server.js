// server.js

const express = require("express");
const app = express();
const port = 3001;

const bookRoutes = require("./routes/books");
app.use(express.json());
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  // Kirim respon dalam format JSON
  res.json({ message: "Hello i am from Server!" });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);  
});
 	
