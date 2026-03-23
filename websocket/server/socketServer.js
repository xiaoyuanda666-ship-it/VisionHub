import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("message", (data) => {
    console.log("message:", data);

    // send to everyone
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

try{
    server.listen(3000, () => {
    console.log("server running on http://localhost:3000");
  });
} catch {
  console.log("error")
}