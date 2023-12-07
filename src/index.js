const express = require("express");
const path = require("path");
const handler = require("./handler.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "photos" directory
app.use(express.static(path.join(__dirname, "photos")));

// Use your existing handler
app.use(handler);

// Define a route for john.html
app.get('/john.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'john.html'));
});

app.get('/sandra.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'sandra.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
