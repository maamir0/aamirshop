require("dotenv").config();
const express = require("express");
const app = require("./app");
const server = express();
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

const PORT = process.env.PORT;

server.use(app);

// io.on("connection", (socket) => {
//   console.log("A User Connected:");
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// 80, "0.0.0.0",
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
