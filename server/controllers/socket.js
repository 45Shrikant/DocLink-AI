const { Server } = require("socket.io");

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ Update this for production (specific domain)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket Connected: ${socket.id}`);

    socket.on("room:join", ({ email, room }) => {
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      socket.join(room);
      io.to(room).emit("user:joined", { email, id: socket.id });
      io.to(socket.id).emit("room:join", { email, room });
    });

    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("disconnect", () => {
      const email = socketidToEmailMap.get(socket.id);
      if (email) {
        emailToSocketIdMap.delete(email);
        socketidToEmailMap.delete(socket.id);
      }
      console.log(`❌ Socket Disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
