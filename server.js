const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer

const PORT = 5001

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room/:name", (req, res) => {
  res.render("room", { 
    roomId: req.params.room,
    name: req.params.name
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });

    socket.on('disconnected', () =>{
      io.to(roomId).emit({
        text: 'disconnected',
      })  
    });
  });

});

port = process.env.PORT || 5001

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});